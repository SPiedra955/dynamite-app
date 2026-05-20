import os
import stripe  # type: ignore
from flask import request, jsonify  # type: ignore
from api.blueprint import api
from api.models import db, Order, User
stripe.api_key = os.getenv("STRIPE_SECRET_KEY")  # KEY INSIDE .ENV


@api.route("/create-checkout-session", methods=["POST"])
def create_checkout_session():
    try:
        data = request.get_json()

        products = data.get("products", [])

        line_items = []

        for product in products:
            line_items.append({
                "price_data": {
                    "currency": "eur",
                    "product_data": {
                        "name": product["name"],
                    },
                    "unit_amount": int(product["price"] * 100),
                },
                "quantity": 1,
            })

        session = stripe.checkout.Session.create(
            payment_method_types=["card"],
            mode="payment",
            line_items=line_items,
            # [
            #     {
            #         "price_data": {
            #             "currency": "eur",
            #             "product_data": {
            #                 "name": data.get("product_name", "Product"),
            #             },
            #             "unit_amount": data.get("amount", 2000),
            #         },
            #         "quantity": 1,
            #     }
            # ],
            success_url="https://improved-broccoli-qjj4qq6pg67394pq-3000.app.github.dev/",
            cancel_url="https://improved-broccoli-qjj4qq6pg67394pq-3000.app.github.dev/",
        )
        # SEND DATA
        # metadata = {
        #     "user_id": store.user.id,
        #     "product_name": data.get("product_name"),
        # }
        

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
            payload, sig_header, endpoint_secret
        )
    except Exception as e:
        return str(e), 400

    if event["type"] == "checkout.session.completed":
        session = event["data"]["object"]
        print("Pago completado:", session["id"])

    #  # EXTRAER INFO
    #     user_id = session.get("metadata", {}).get("user_id")
    #     product_name = session.get("metadata", {}).get("product_name")
    #     amount = session.get("amount_total")

    #     #  GUARDAR EN DB
    #     order = Order(
    #         user_id=user_id,
    #         total_price=amount,
    #         status="paid"
    #         stripe_session_id=session["id"],
    #     )

    #     db.session.add(order)
    #     db.session.commit()
    return jsonify({"status": "ok"})
