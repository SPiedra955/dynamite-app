from flask import Flask, request, jsonify
from api.models import db, User, Product, Order, OrderItem, SubscriptionPlan, Subscription, Payment, Cart, CartItem, MyPlan, DietExerciseType,PaymentStatus
from sqlalchemy import select
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required
from api.blueprint import api
from werkzeug.security import generate_password_hash
from datetime import datetime



# ── MY PLANS ──────────────────────────────────────────────────────────────────

# GET ALL MY PLANS


@api.route('/myplans', methods=['GET'])
def get_myplans():
    plans = db.session.execute(select(MyPlan)).scalars().all()
    transform = [plan.serialize() for plan in plans]
    return jsonify({"success": True, "data": transform}), 200

# GET ONE PLAN BY USER


@api.route('/myplans/<int:user_id>', methods=['GET'])
def get_user_myplans(user_id):
    # execute() porque buscamos por user_id que NO es la primary key
    plans = db.session.execute(select(MyPlan).where(
        MyPlan.user_id == user_id)).scalars().all()
    transform = [plan.serialize() for plan in plans]
    return jsonify({"success": True, "data": transform}), 200

# CREATE PLAN
# En el endpoint POST conviertes el string que llega del frontend al enum


@api.route('/myplans', methods=['POST'])
def create_myplan():
    body = request.get_json()

    if not body['user_id'] or not body['plan_id']:
        return jsonify({"sucess": True, "msg": "missing data"}), 403
    # Lo convertimos al enum
    # llega "diet" desde el frontend
    try:
        tipo = DietExerciseType(body['tipo_plan'])
    except ValueError:
        return jsonify({"success": False, "msg": "tipo_plan must be'diet'or 'workout'"}), 400
 # Ahora sí se lo pasamos al modelo como enum
    new_myplan = MyPlan(
        user_id=body['user_id'],
        plan=body['plan_id'],
        tipo_plan=tipo,
        plan_data=body.get('plan_data')
    )
    
    db.session.add(new_myplan)
    
    db.session.commit()
    
    return jsonify({"sucess": True, "data": new_myplan.serialize()}), 200

# UPDATE MYPLAN


@api.route('/update/myplan/<int:plan_id>', methods=['PUT'])
def update_subscription_plan(plan_id):
    
    myplan = db.session.get(MyPlan, plan_id)

    if not myplan:
        return jsonify({"success": False, "msg": "not found"}), 404

    body = request.get_json()

    if body.get('tipo_plan'):
        try:
            # convertimos el string "diet" o "workout" al enum
            myplan.tipo_plan = DietExerciseType(body['tipo_plan'])
        except ValueError:
            # si manda algo que no existe en el enum, devolvemos error

            return jsonify({"success": False, "msg": "tipo_plan must be'diet'or 'workout'"}), 400


# - si el frontend manda plan_data → usa el nuevo valor
# - si no lo manda → mantén el valor que ya tenía

    myplan.plan_data = body.get('plan_data', myplan.plan_data)
    
    db.session.commit()
    
    return jsonify({"success": True, "data": myplan.serialize()}), 200


# DELETE MY PLAN 

@api.route('/delete/myplan/<int:plan_id>', methods=['DELETE'])
def delete_subscription_plan(plan_id):
    
    myplan = db.session.get(MyPlan, plan_id)

    if not myplan:
        return jsonify({"success": False, "msg": "not found"}), 404

    
    db.session.delete(myplan)
    
    db.session.commit()
    
    return jsonify({"success": True, "data": "user deleted " + str(plan_id)}), 200