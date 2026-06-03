from flask import Flask, request, jsonify
from src.api.models import db, User, Product, Order, OrderItem, SubscriptionPlan, Subscription, Payment, Cart, CartItem, MyPlan, DietExerciseType,PaymentStatus
from sqlalchemy import select
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required
from src.api.blueprint import api
from werkzeug.security import generate_password_hash
from datetime import datetime


#  —— PAGOS ————————————————————————————————————————————————————————————————————————————————
# GET ALL MY Pays


@api.route('/payments', methods=['GET'])
def get_payments():
    payments = db.session.execute(select(Payment)).scalars().all()
   
    transform = [payment.serialize() for payment in payments]
   
    return jsonify({"success": True, "data": transform}), 200

# GET PAYMENT BY USER


@api.route('/payments/<int:user_id>', methods=['GET'])
def get_user_payments(user_id):
    # execute() porque buscamos por user_id que NO es la primary key
    payments = db.session.execute(select(Payment).where(
        Payment.user_id == user_id)).scalars().all()
   
    transform = [payment.serialize() for payment in payments]
    
    return jsonify({"success": True, "data": transform}), 200


# CREATE PAYMENT
api.route ('/payments', methods=['GET'])

def create_payment():
    body = request.get_json()

    if not body ['user_id'] or not body ['amount'] or not body ['payment_method']:
        return jsonify ({"success": False, "msg": "missing data"}), 403
    if not body.get('order_id') and not body.get('subscription_id'):
        return jsonify({"success":False, "msg": "must provide order_id or subscription_id"}),400
    
    new_payment = Payment(
        user_id = body['user_id'],
        order_id = body.get ('order_id'),
        subscription_id=body.get('subscription_id'),
        amount = body["amount"],
        payment_method =body['payment_method'],
        status = PaymentStatus.paid ) 

    db.session.add(new_payment)

    if body.get('order_id'):
        order = db.session.get(Order,body['order_id'])

        if order:
            order.status = "paid"

    db.session.commit()
    
    return jsonify({"success":True,"data":new_payment.serialize()}), 200                 