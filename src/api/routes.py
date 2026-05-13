"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify
from api.models import db, User, Product, Order, OrderItem, SubscriptionPlan, Subscription, Payment, Cart, CartItem
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from sqlalchemy import select
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required
from api.blueprint import api
from api.api_routes.products import *


# Allow CORS requests to this API
CORS(api)


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200

# ADMIN SEED


@api.route('/seed', methods=['GET'])
def seed_admin():
    existing_admin = User.query.filter_by(email="admin@test.com").first()

    if existing_admin:
        return jsonify({"msg": "Admin already exists"}), 200

    admin = User(
        email="admin@test.com",
        password=generate_password_hash("1234"),
        name="Admin",
        age=30,
        weight=70,
        height=175,
        objective="admin",
        role="admin",
        is_active=True
    )

    db.session.add(admin)
    db.session.commit()
    print("Admin created")
    return jsonify({"msg": "Admin created"}), 201

# LOGIN/REGISTER


@api.route('/auth', methods=['POST'])
def auth():
    try:
        body = request.get_json()

        if not body or not body.get('email') or not body.get('password'):
            return jsonify({
                "success": False,
                "data": "missing info"
            }), 400

        user = db.session.execute(
            select(User).where(User.email == body.get('email'))
        ).scalar_one_or_none()

        if body.get('type') == 'register':
            if user:
                return jsonify({'success': False, 'data': 'email taken'}), 403

            hashed = generate_password_hash(body['password'])
            new_user = User(
                email=body['email'],
                password=hashed,
                name=body['name'],
                age=body['age'],
                weight=body['weight'],
                height=body['height'],
                objective=body['objective'],
                is_active=True
            )
            db.session.add(new_user)
            db.session.commit()

            token = create_access_token(identity=str(new_user.id))

            return jsonify({
                'success': True,
                'data': new_user.serialize(),
                'token': token
            }), 201

        if body.get('type') == 'login':
            if not user:
                return jsonify({'success': False, 'data': 'email not found'}), 404

            if not check_password_hash(user.password, body['password']):
                return jsonify({'success': False, 'data': 'incorrect email or password'}), 401

            token = create_access_token(identity=str(user.id))

            return jsonify({
                'success': True,
                'data': user.serialize(),
                'token': token
            }), 200

        return jsonify({'success': False, 'data': 'invalid type'}), 400

    except Exception as e:
        print("ERROR BACKEND:", e)
        return jsonify({
            "success": False,
            "data": "internal server error"
        }), 500


# ADD A NEW PRODUCT TO THE BBDD

@api.route("/products", methods=["POST"])
@jwt_required()  # PROTECTING ROUTE STEP 1
def new_product():
    user_id = get_jwt_identity()  # PROTECTING ROUTE STEP 2
    user = db.session.get(User, user_id)  # PROTECTING ROUTE

    if user.role != "admin":  # PROTECTING ROUTE STEP 3
        return jsonify({"success": False, "msg": "forbidden"}), 403

    body = request.get_json()
    if not body['name'] or not body["description"] or not body['price'] or not body['stock'] or not body['category'] or not body['image']:
        return jsonify({'success': False, 'msg': 'missing data'}), 403

    new_product = Product(
        name=body['name'],
        description=body['description'],
        price=body['price'],
        stock=body['stock'],
        category=body['category'],
        image=body['image'],
    )
    db.session.add(new_product)
    db.session.commit()
    return jsonify({"success": True, "data": new_product.serialize()}), 200

# GET A PRODUCT BY HIS ID


@api.route("/product/<int:id>", methods=["GET"])
# @jwt_required()
def get_product(id):
   # user_id = get_jwt_identity()
    # user = db.session.get(User, user_id)

   # if user.role != "admin":
    #    return jsonify({"success": False, "msg": "forbidden"}), 403

    product = db.session.get(Product, id)

    if not product:
        return jsonify({"success": False, "msg": "not found"}), 404

        return jsonify({"success": True, "data": product.serialize()}), 200

# GET ALL PRODUCTS


@api.route("/products", methods=["GET"])
def get_all_products():
    products = db.session.execute(select(Product)).scalars().all()
    transform = [product.serialize() for product in products]
    return jsonify({"success": True, "data": transform}), 200

# UPDATE PRODUCT


@api.route("/product/update/<int:id>", methods=["PUT"])
@jwt_required()
def modify_product(id):
    user_id = get_jwt_identity()
    user = db.session.get(User, user_id)

    if user.role != "admin":
        return jsonify({"success": False, "msg": "forbidden"}), 403

    product = db.session.get(Product, id)

    if not product:
        return jsonify({"success": False, "data": "not found"}), 404

    body = request.get_json()

    product.name = body["name"] if body["name"] else product.name
    product.description = body["description"] if body["description"] else product.description
    product.price = body["price"] if body["price"] else product.price
    product.stock = body["stock"] if body["stock"] else product.stock
    product.category = body["category"] if body["category"] else product.category
    product.image = body["image"] if body["image"] else product.image

    db.session.commit()

    return jsonify({"success": True, "data": product.serialize()})

# DELETE PRODUCT


@api.route("/product/delete/<int:id>", methods=["DELETE"])
@jwt_required()
def delete_product(id):
    user_id = get_jwt_identity()
    user = db.session.get(User, user_id)

    if user.role != "admin":
        return jsonify({"success": False, "msg": "forbidden"}), 403

    product = db.session.get(Product, id)

    if not product:
        return jsonify({"success": False, "msg": "not found"}), 404

    db.session.delete(product)
    db.session.commit()
    return jsonify({"success": True, "data": "product deleted " + str(id)}), 200
