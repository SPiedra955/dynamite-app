# from flask import Flask, request, jsonify
# from api.models import db, User, Product, Order, OrderItem, SubscriptionPlan, Subscription, Payment, Cart, CartItem, MyPlan, DietExerciseType,PaymentStatus
# from sqlalchemy import select
# from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required
# from api.blueprint import api
# from werkzeug.security import generate_password_hash
# from datetime import datetime


# # ── PLANES DE SUSCRIPCIÓN ─────────────────────────────────────────────────────


# @api.route('/subscription-plans', methods=['GET'])
# def get_subscription_plans():
#     plans = db.session.execute(select(SubscriptionPlan)).scalars().all()
#     transform = [plan.serialize() for plan in plans]
#     return jsonify({"success": True, "data": transform}), 200


# # GET SUBSCRIPTION PLAN
# @api.route('/subscription-plans/<int:user_id>', methods=['GET'])
# def get_subscription_plan(plan_id):
#     plan = db.session.get(SubscriptionPlan, plan_id)

#     if not plan:
#         return jsonify({"success": False, "msg": "not found"}), 404

#     return jsonify({"success": True, "data": plan.serialize()}), 200

# # CREATE SUBSCRIPTION PLAN

# @api.route('/subscription-plans', methods=['POST'])
# def create_subscription_plan():
#     body = request.get_json()

#     if not body['name'] or not body['price']:
#         return jsonify({"sucess": True, "msg": "missing data"}), 403

#     new_plan = SubscriptionPlan(
#         name=body['name'],
#         price=body['price'],
#         description=body.get('description')
#     )
#     db.session.add(new_plan)
#     db.session.commit()
#     return jsonify({"sucess": True, "data": new_plan.serialize()}), 200

# # UPDATE SUBSCRIPTION PLAN


# @api.route('/update/subscription-plan/<int:plan_id>', methods=['PUT'])
# def update_subscription_plan(plan_id):
#     plan = db.session.get(SubscriptionPlan, plan_id)

#     if not plan:
#         return jsonify({"success": False, "msg": "not found"}), 404

#     body = request.get_json()
#     plan.name = body.get('name', plan.name)
#     plan.price = body.get('price', plan.price)
#     plan.description = body.get('description', plan.description)

#     db.session.commit()
#     return jsonify({"success": True, "data": plan.serialize()}), 200

# # DELETE SUBS PLAN


# @api.route('/delete/subscripton-plan/<int:plan_id>', methods=['DELETE'])
# def delete_subscription_plan(plan_id):
#     plan = db.session.get(SubscriptionPlan, plan_id)

#     if not plan:
#         return jsonify({"success": False, "msg": "not found"}), 404

#     db.session.delete(plan)
#     db.session.commit()
#     return jsonify({"success": True, "data": "user deleted " + str(plan_id)}), 200