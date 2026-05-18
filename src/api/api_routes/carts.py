from flask import Flask, request, jsonify
from api.models import db, User, Product, Order, OrderItem, SubscriptionPlan, Subscription, Payment, Cart, CartItem, MyPlan, DietExerciseType,PaymentStatus
from sqlalchemy import select
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required
from api.blueprint import api
from werkzeug.security import generate_password_hash
from datetime import datetime


# ── CARRITO ───────────────────────────────────────────────────────────────────

#  GET CART BY USER

@api.route('/cart/<int:user_id>', methods={'GET'})
def get_cart(user_id):
    cart = db.session.execute(select(Cart).where(
        Cart.user_id == user_id)).scalar_one_or_none()

    if not cart:
        return jsonify({"success": False, "msg": "not found"}), 404

    items = [item.serialize()for item in cart.cart_items]
    return jsonify({"sucess": True,
                    "data": {"cart": cart.serialize(),
                             "items": items}}), 200


# ADD PRODUCT CART

@api.route('/cart', methods={'POST'})
def add_to_cart():
    body = request.get_json()

    if not body['user_id'] or not body['product_id'] or not body['quantity']:
        return jsonify({'success': False, 'msg': 'missing data'}), 403
#  buscar o crear carrito

    cart = db.session.execute(select(Cart).where(
        Cart.user_id == body['user_id'])).scalar_one_or_none()
    if not cart:
        cart = Cart(user_id=body['user_id'])
        db.session.add(cart)
        db.session.flush()

 # producto no se repita y sume cantidad de productos

    existing_item = db.session.execute(select(CartItem).where(
        CartItem.cart_id == cart.id, CartItem.product_id == body['product_id'])).scalar_one_or_none()

    if existing_item:
        existing_item.quantity += body['quantity']

    else:
        new_item = CartItem(
            cart_id=cart.id,
            product_id=body['product_id'],
            quantity=body['quantity']
        )
        db.session.add(new_item)

    db.session.commit()
    return jsonify({"success": True, "data": "product added to cart"}), 200

# DELETE ITEM FROM CART


@api.route('/delete/cart/<int:item_id>', methods=['DELETE'])
def remove_from_cart(item_id):
    item = db.session.get(User, item_id)

    if not item:
        return jsonify({"success": False, "msg": "not found"}), 404

    db.session.delete(item)
    db.session.commit()
    return jsonify({"success": True, "data": "user deleted " + str(item_id)}), 200
