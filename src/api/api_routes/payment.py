import os
import stripe  # type: ignore
from flask import request, jsonify  # type: ignore
from api.blueprint import api
import hashlib
from api.models import (
    db,
    User,
    Product,
    Order,
    OrderItem,
    SubscriptionPlan,
    Subscription,
    Payment,
    Cart,
    CartItem,
    PaymentStatus,
)
from datetime import datetime, UTC
from decimal import Decimal
from sqlalchemy import select  # type: ignore
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required  # type: ignore

stripe.api_key = os.getenv("STRIPE_SECRET_KEY")  # KEY INSIDE .ENV


@api.route("/create-subscription-checkout", methods=["POST"])
@jwt_required
def create_subscription_checkout():
    try:
        data = request.get_json()
        plan_id = data.get("subscription_plan_id")
        if not plan_id:
            return jsonify({"error": "Subscription plan required"}), 404
        plan = SubscriptionPlan.query.get(plan_id)
        
        if not plan:
            return jsonify({"error": "Plan not found"}), 404
        
        user_id = int(get_jwt_identity())
        
        session = stripe.checkout.Session.create(
            payment_method_types=["card"],
            mode="subscription",
            line_items=[
                {
                    "price": plan.stripe_price_id,
                    "quantity": 1,
                    }
                ],
            
            success_url="https://improved-broccoli-qjj4qq6pg67394pq-3000.app.github.dev/successful-payment",

            cancel_url="https://improved-broccoli-qjj4qq6pg67394pq-3000.app.github.dev/payment-error",

            metadata = {
                "type": "subscription",
                "user_id": str(user_id),
                "plan_id": str(plan.id),
            })
        return jsonify({"url": session.url}), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 400
            
            

@api.route("/create-checkout-session", methods=["POST"])
@jwt_required()
def create_checkout_session():

    try:

        data = request.get_json()

        products = data.get("products", [])

        user_id = int(get_jwt_identity())

        line_items = []

        total = Decimal("0.00")

        # CREATE ORDER
        order = Order(
            user_id=user_id,
            total_price=Decimal("0.00"),
            status="pending",
            created_at=datetime.now(UTC),
        )

        db.session.add(order)
        db.session.flush()
        # print(products)
        # print(Product.query.all())
        for item in products:

            product_id = int(item["id"])
            product = Product.query.get(product_id)
            # print('soy el id ', product_id)

            if not product:
                return jsonify({"error": "Product not found"}), 404

            quantity = int(item["quantity"])

            if product.stock < quantity:
                return jsonify({"error": "Insufficient stock"}), 400

            subtotal = product.price * quantity
            total += subtotal

            # ORDER ITEM
            order_item = OrderItem(
                order_id=order.id,
                product_id=product.id,
                quantity=quantity,
                price=product.price,
            )

            # CART ITEMS

            db.session.add(order_item)

            # STRIPE ITEMS
            line_items.append(
                {
                    "price_data": {
                        "currency": "eur",
                        "product_data": {
                            "name": product.name,
                        },
                        "unit_amount": int(product.price * 100),
                    },
                    "quantity": quantity,
                }
            )

        order.total_price = total

        db.session.flush()

        # STRIPE SESSION
        session = stripe.checkout.Session.create(
            payment_method_types=["card"],
            mode="payment",
            line_items=line_items,
            customer_email=data.get("email"),

            success_url="https://improved-broccoli-qjj4qq6pg67394pq-3000.app.github.dev/successful-payment",

            cancel_url="https://improved-broccoli-qjj4qq6pg67394pq-3000.app.github.dev/payment-error",

            metadata={
                "type":"payment",
                "order_id": str(order.id),
            },
        )
        order.stripe_session_id = session.id

        db.session.commit()

        return jsonify({"url": session.url})

    except Exception as e:
        db.session.rollback()
        print("CHECKOUT ERROR:", repr(e))
        return jsonify({"error": str(e)}), 400


@api.route("/stripe-webhook", methods=["POST"])
def stripe_webhook():

    endpoint_secret = os.getenv("STRIPE_WEBHOOK_SECRET")
    sig_header = request.headers.get("Stripe-Signature")
    payload = request.get_data(cache=False)
    
    try:
        
        event = stripe.Webhook.construct_event(
            payload,
            sig_header,
            endpoint_secret
        )
    
    except Exception as e:
        return jsonify({"error": str(e)}), 400

    if event["type"] != "checkout.session.completed":
        return jsonify({"status": "ignored"}), 200

    session = event["data"]["object"]

    if session["payment_status"] != "paid":
        return jsonify({"status": "unpaid"}), 200
    
    metadata = session.get("metadata", {})
    checkout_type = metadata.get("type")
    
    stripe_session_id = session["id"]
    
    if checkout_type == "payment":
        order_id = metadata.get("order_id")

        order = Order.query.get(order_id)
    
        if not order:
            return jsonify({"error": "Order not found"}), 404
        
        order.status = "paid"
            

        #  2. descontar stock
        for item in order.order_items:
            product = item.product
            product.stock -= item.quantity

        #  3. crear payment
        payment = Payment(
            user_id=order.user_id,
            order_id=order.id,
            amount=order.total_price,
            payment_method="stripe",
            status=PaymentStatus.paid,
            stripe_session_id=stripe_session_id,
            created_at=datetime.now(UTC),
        )

        db.session.add(payment)
        
    elif checkout_type == "subscription":

        user_id = metadata.get("user_id")
        plan_id = metadata.get("plan_id")

        subscription = Subscription(
            user_id=user_id,
            plan_id=plan_id,
            stripe_subscription_id=session["subscription"],
            status="active",
            created_at=datetime.now(UTC),
        )
        
        db.session.add(subscription)
    db.session.commit()
        
    cart = Cart(
        user_id=order.user_id,
        created_at=datetime.now(UTC)
    )

    db.session.add(cart)
    db.session.flush()

    for item in order.order_items:
        cart_item = CartItem(
            cart_id=cart.id,
            product_id=item.product_id,
            quantity=item.quantity
        )
        db.session.add(cart_item)

    db.session.commit() 

    return jsonify({"status": "success"}), 200


# GET ORDERS


@api.route("/orders", methods=["GET"])
def get_all_orders():
    orders = db.session.execute(select(Order)).scalars().all()
    transform = [order.serialize() for order in orders]
    return jsonify({"success": True, "data": transform}), 200
