from flask import Flask, request, jsonify
from api.models import db, User, Product, Order, OrderItem, SubscriptionPlan, Subscription, Payment, Cart, CartItem
from sqlalchemy import select
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required
from api.blueprint import api
from werkzeug.security import generate_password_hash

# GET ALL USERS
@api.route("/users",methods=['GET'])
def get_all_users() :
    users =db.session.execute(select(User)).scalars().all()
    transform = [user.serialize() for user in users]
    return jsonify({"success": True, "data": transform}), 200

# CREATE NEW USER
@api.route("/users",methods=['POST'])

def new_user():
    body = request.get_json()
    if not body['name'] or not body["email"] or not body['password'] or not body['age'] or not body['weight'] or not body['height']or not body['objective']or not body['photo']:
        return jsonify({'success': False, 'msg': 'missing data'}), 403

    hashed_password = generate_password_hash(body["password"])

    new_user = User(
            name=body['name'],
            email=body['email'],
            password=hashed_password,
            age=body['age'],
            weight=body['weight'],
            height=body['height'],
            objective=body['objective'],
            photo=body['photo'],
    )
    db.session.add(new_user)
    db.session.commit()
    return jsonify({"success": True, "data": new_user.serialize()}), 200    

#UPDATE USER

@api.route("/update/user/<int:id>",methods=['PUT'])

def update_user(id):
    user = db.session.get(User, id)

    if not user:
        return jsonify({"success": False, "data": "not found"}), 404

   
    body = request.get_json()
    user.name = body.get("name", user.name)
    user.email = body.get("email", user.email)

    if body.get("password"):
        user.password = generate_password_hash(body["password"])

    user.age = body.get("age", user.age)
    user.weight = body.get("weight", user.weight)
    user.height = body.get("height", user.height)
    user.objective = body.get("objective", user.objective)
    user.photo = body.get("photo", user.photo)

    return jsonify({"success": True, "data": user.serialize()})

# DELETE USER


@api.route("/delete/user/<int:id>",methods=['DELETE'])

def delete_user(id):
    
    user= db.session.get(User, id)

    if not user:
        return jsonify({"success": False, "msg": "not found"}), 404

    db.session.delete(user)
    db.session.commit()
    return jsonify({"success": True, "data": "user deleted " + str(id)}), 200


# GET USER ID

@api.route("/user/<int:id>",methods=['GET'])

def get_one_user(id):
    user= db.session.get(User, id)

    if not user:
        return jsonify({"success": False, "msg": "not found"}), 404

    return jsonify({"success": True, "data": user.serialize()}), 200