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

# GET ALL USER SUBSCRIPTIONS 

@api.route('/users/subscriptions', methods=['GET'])
def get_users_subscriptions():
    result = db.session.execute(
        select(User, Subscription, SubscriptionPlan)
        .outerjoin(Subscription, Subscription.user_id == User.id)
        .outerjoin(SubscriptionPlan, Subscription.plan_id == SubscriptionPlan.id)
    ).all()
    
    data = []

    for user, sub, plan in result:
        data.append({
            "user": user.serialize(),
            "subscription": sub.serialize() if sub else None,
            "plan": plan.serialize() if plan else None
        })

    return jsonify({"success": True, "data": data}), 200


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

# GET SUBSCRIPTION PLAN BY ID


@api.route('/subscription-plans/<int:plan_id>', methods=['GET'])
def get_subscription_plan(plan_id):
    plan = db.session.get(SubscriptionPlan, plan_id)

    if not plan:
        return jsonify({"success": False, "msg": "not found"}), 404

    return jsonify({"success": True, "data": plan.serialize()}), 200

# BAN USERS

@api.route('/admin/user/<int:user_id>/ban', methods=['PATCH'])
def ban_user(user_id):
    user = User.query.get(user_id)

    user.is_banned = True
    db.session.commit()

    return jsonify({"msg": "User banned"})


@api.route('/admin/user/<int:user_id>/unban', methods=['PATCH'])
def unban_user(user_id):
    user = User.query.get(user_id)

    user.is_banned = False
    user.ban_reason = None
    db.session.commit()

    return jsonify({"msg": "User unbanned"})