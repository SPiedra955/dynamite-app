from flask import Flask, request, jsonify  # type: ignore
from api.models import db, User, Product, Order, OrderItem, SubscriptionPlan, Subscription, Payment, Cart, CartItem
from sqlalchemy import select  # type: ignore
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required  # type: ignore
from api.blueprint import api
import pandas as pd
import os

def seed_products_from_csv(path: str):

    df = pd.read_csv(path).head(20)

    products = []

    for _, row in df.iterrows():

        product = Product(
            name=row["product_name"],
            description=row["product_description"],
            price=row["price"],
            stock=100,
            category=row["product_category"],
            image="https://raw.githubusercontent.com/SPiedra955/dynamite-app/main/src/front/assets/img/article.jpg"
        )

        products.append(product)

    db.session.bulk_save_objects(products)
    db.session.commit()

    return len(products)


@api.route("/seed-products", methods=["POST"])
def seed_products():
    try:
        file_path = os.path.join(os.path.dirname(__file__),
        "datasets/bodybuilding_nutrition_products.csv")

        count = seed_products_from_csv(file_path)

        return jsonify({
            "success": True,
            "message": f"{count} products inserted"
        }), 200

    except Exception as e:
        db.session.rollback()

        return jsonify({
            "success": False,
            "error": str(e)
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
    #   return jsonify({"success": False, "msg": "forbidden"}), 403

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
