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
            customer_email=data.get("email"),
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
    print("WEBHOOK SECRET:", endpoint_secret)
    # 1. VALIDAR FIRMA STRIPE
    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, endpoint_secret
        )
    except Exception as e:
        print("❌ Webhook signature error:", str(e))
        return str(e), 400

    # 2. SOLO PROCESAR EVENTO IMPORTANTE
    if event["type"] != "checkout.session.completed":
        return jsonify({"status": "ignored event"}), 200

    session = event["data"]["object"]

    try:
        stripe_session_id = session["id"]
        print("📩 Pago completado:", stripe_session_id)

        # 3. EVITAR DUPLICADOS
        existing_payment = Payment.query.filter_by(
            stripe_session_id=stripe_session_id
        ).first()

        if existing_payment:
            print("⚠️ Pago ya procesado")
            return jsonify({"status": "already processed"}), 200

        # 4. METADATA
        metadata = session.get("metadata") or {}
        user_id = metadata.get("user_id")

        if not user_id:
            print("❌ Missing user_id in metadata")
            return jsonify({"error": "Missing user_id"}), 400

        user_id = int(user_id)

        amount = Decimal(session["amount_total"]) / 100

        # 5. CART
        cart = Cart.query.filter_by(user_id=user_id).first()
        if not cart:
            print("❌ Cart not found")
            return jsonify({"error": "Cart not found"}), 404

        # 6. CREAR ORDER
        order = Order(
            user_id=user_id,
            total_price=amount,
            status="paid",
            created_at=datetime.now(UTC),
        )

        db.session.add(order)
        db.session.flush()  # para obtener order.id

        # 7. CREAR ITEMS
        has_error = False

        for cart_item in cart.cart_items:
            product = cart_item.product

            if product.stock < cart_item.quantity:
                has_error = True
                break

            order_item = OrderItem(
                order_id=order.id,
                product_id=cart_item.product_id,
                quantity=cart_item.quantity,
                price=product.price,
            )

            db.session.add(order_item)

            # actualizar stock
            product.stock -= cart_item.quantity

        # si hay error → rollback total
        if has_error:
            db.session.rollback()
            print("❌ Stock insuficiente")
            return jsonify({"error": "Insufficient stock"}), 400

        # 8. PAYMENT
        payment = Payment(
            user_id=user_id,
            order_id=order.id,
            amount=amount,
            payment_method="stripe",
            status="completed",
            stripe_session_id=stripe_session_id,
            created_at=datetime.now(UTC),
        )

        db.session.add(payment)

        # 9. VACÍO DE CARRITO
        CartItem.query.filter_by(cart_id=cart.id).delete()

        # 10. COMMIT FINAL
        db.session.commit()

        print("✅ Todo guardado correctamente en DB")

        return jsonify({"status": "ok"}), 200

    except Exception as e:
        db.session.rollback()
        print("🔥 ERROR WEBHOOK:", str(e))
        return jsonify({"error": str(e)}), 500