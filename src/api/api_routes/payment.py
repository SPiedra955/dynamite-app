import os
import stripe  # type: ignore
from flask import request, jsonify  # type: ignore
from api.blueprint import api
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
)
from datetime import datetime, UTC
from decimal import Decimal

stripe.api_key = os.getenv("STRIPE_SECRET_KEY")  # KEY INSIDE .ENV


@api.route("/create-checkout-session", methods=["POST"])
def create_checkout_session():
    try:
        data = request.get_json()

        products = data.get("products", [])

        line_items = []

        for product in products:
            line_items.append(
                {
                    "price_data": {
                        "currency": "eur",
                        "product_data": {
                            "name": product["name"],
                        },
                        "unit_amount": int(product["price"] * 100),
                    },
                    "quantity": int(product["quantity"]),
                }
            )

        session = stripe.checkout.Session.create(
            payment_method_types=["card"],
            mode="payment",
            line_items=line_items,
            success_url="https://improved-broccoli-qjj4qq6pg67394pq-3000.app.github.dev/successful-payment",
            cancel_url="https://improved-broccoli-qjj4qq6pg67394pq-3000.app.github.dev/payment-error",
            # SEND DATA
            metadata={
                "user_id": data["user_id"],
                "created_at": datetime.now(UTC).isoformat(),
            },
        )

        return jsonify({"url": session.url})

    except Exception as e:
        return jsonify({"error": str(e)}), 400


@api.route("/stripe-webhook", methods=["POST"])
def stripe_webhook():
    payload = request.data
    sig_header = request.headers.get("Stripe-Signature")
    endpoint_secret = os.getenv("STRIPE_WEBHOOK_SECRET")

    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, endpoint_secret)
    except Exception as e:
        return str(e), 400

    if event["type"] == "checkout.session.completed":
        session = event["data"]["object"]
        stripe_session_id = session["id"]
        print("Pago completado:", session["id"])

        # AVOIDING DUPLICATE PAYMENTS
        # existing_payment = Payment.query.filter_by(
        #     stripe_session_id=stripe_session_id
        # ).first()

        # if existing_payment:
        #     return jsonify({"status": "already processed"}), 200

        # EXTRAER INFO
        metadata = session.get("metadata", {})

        user_id = metadata.get("user_id")

        if not user_id:
            return jsonify({"error": "Missing user_id"}), 400

        user_id = int(user_id)

        amount = Decimal(session["amount_total"]) / 100

        # CHECK IF CART EXISTS
        cart = Cart.query.filter_by(user_id=user_id).first()
        if not cart:
            return jsonify({"error": "Cart not found"}), 404

        #  GUARDAR EN DB
        order = Order(
            user_id=user_id,
            total_price=amount,
            status="paid",
            created_at=datetime.now(UTC),
            # stripe_session_id=session["id"]
        )

        db.session.add(order)
        db.session.flush()  # SEND DATA WITHOUT SAVING THE CHANGES
        # COPY PRODUCTS
        for cart_item in cart.cart_items:
            if cart_item.product.stock < cart_item.quantity:
                return jsonify({"error": "Insufficient stock"}), 400

            order_item = OrderItem(
                order_id=order.id,
                product_id=cart_item.product_id,
                quantity=cart_item.quantity,
                price=cart_item.product.price,
            )

            db.session.add(order_item)

            cart_item.product.stock -= cart_item.quantity

        # CREATE PAYMENT
        payment = Payment(
            user_id=user_id,
            order_id=order.id,
            amount=amount,
            payment_method="stripe",
            status="completed",
            created_at=datetime.now(UTC),
            # añadir esta columna al modelo payments
            # stripe_session_id=stripe_session_id
            # stripe_session_id: Mapped[str] = mapped_column(
            #     String(255),
            #     unique=True,
            #     nullable=True
            # )
        )

        db.session.add(payment)

        # vaciar carrito
        CartItem.query.filter_by(cart_id=cart.id).delete()
        db.session.commit()

        print("Pago completado:", stripe_session_id)

        return jsonify({"status": "ok"})
