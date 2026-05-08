"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Product, Order, OrderItem, SubscriptionPlan, Subscription, Payment, Cart, CartItem
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from sqlalchemy import select

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200

# ADD A NEW PRODUCT TO THE BBDD


@api.route("/products", methods=["POST"])
def new_product():
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
def get_product(id):
    product = db.session.get(Product, id)
    return jsonify({"success": True, "data": product.serialize()}), 200

# UPDATE PRODUCT


@api.route("/product/update/<int:id>", methods=["PUT"])
def modify_product(id):
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
def delete_product(id):
    product = db.session.get(Product, id)
    db.session.delete(product)
    db.session.commit()
    return jsonify({"success": True, "data": "product deleted " + str(id)}), 200
