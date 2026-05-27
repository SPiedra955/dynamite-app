from flask import Flask, request, jsonify
from api.models import db, User, Product, Order, OrderItem, SubscriptionPlan, Subscription, Payment, Cart, CartItem, MyPlan, DietExerciseType, PaymentStatus
from sqlalchemy import select
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required
from api.blueprint import api
from werkzeug.security import generate_password_hash
from datetime import datetime


# ── SUSCRIPCIONES ─────────────────────────────────────────────────────────────

# CHECK IF USER HAS SUBSCRIPTION ACTIVE
@api.route('/subscription/me', methods=["GET"])
@jwt_required()
def check_subscription():
    user_id = int(get_jwt_identity())
    sub = Subscription.query.filter_by(user_id=user_id).first()
    if not sub:
        return jsonify({"success": False, "msg": "no active subscription"}), 404
    return jsonify({"success": True, "data": sub.serialize()}), 200


# GET ALL SUBSCRIPTIONS PLANS

@api.route('/subscription-plans', methods=['GET'])
def get_subscription_plans():
    plans = db.session.execute(select(SubscriptionPlan)).scalars().all()
    transform = [plan.serialize() for plan in plans]
    return jsonify({"success": True, "data": transform}), 200


@api.route('/subscriptions', methods=['GET'])
def get_subscriptions():
    subs = db.session.execute(select(SubscriptionPlan)).scalars().all()
    transform = [sub.serialize() for sub in subs]
    return jsonify({"success": True, "data": transform}), 200

# GET SUBSCRIPTIONS BY USER


@api.route('/subscriptions/<int:user_id>', methods=['GET'])
def get_user_subscriptions(user_id):
    # execute() porque buscamos por user_id que NO es la primary key
    subs = db.session.execute(select(Subscription).where(
        Subscription.user_id == user_id)).scalars().all()
    transform = [sub.serialize() for sub in subs]
    return jsonify({"success": True, "data": transform}), 200

# CREATE SUBSCRIPTION


@api.route('/subscriptions', methods=['POST'])
def create_subscription():
    body = request.get_json()

    if not body['user_id'] or not body['plan_id']:
        return jsonify({"success": False, "msg": "missing data"}), 403

    plan = db.session.get(SubscriptionPlan, body['plan_id'])

    if not plan:
        return jsonify({"success": False, "msg": "plan not found"}), 404
    # Buscamos en la tabla subscriptions
    create = db.session.execute(select(Subscription).where(Subscription.user_id == body['user_id'],
                                                           Subscription.active == True)).scalar_one_or_none()
    # # devuelve un objeto o None si no encuentra nada

    if create:
        return jsonify({"success": False, "msg": "already has an active subscription"}), 400

    new_subscription = Subscription(
        user_id=body['user_id'],
        plan_id=body['`plan_id'],
        active=True
    )
    db.session.add(new_subscription)
    db.session.commit()
    return jsonify({"sucess": True, "data": new_subscription.serialize()}), 200


# CANCEL SUBSCRIPTION

@api.route('/cancel/subscription/<int:subscription_id>', methods=['PUT'])
def cancel_subscription(subscription_id):
    subscription = db.session.get(Subscription, subscription_id)
    if not subscription:
        return jsonify({"success": False, "msg": "not found"}), 404
    subscription.active = False
    subscription.cancel_day = datetime.utcnow()

    db.session.commit()
    return jsonify({"success": True, "data": subscription.serialize()}), 200
