from flask import Flask, request, jsonify
from api.models import db, User, Product, Order, OrderItem, SubscriptionPlan, Subscription, Payment, Cart, CartItem, MyPlan, DietExerciseType, PaymentStatus
from sqlalchemy import select
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required
from api.blueprint import api
from werkzeug.security import generate_password_hash
from datetime import datetime
 
 
# ── CARRITO ───────────────────────────────────────────────────────────────────
 
# GET CART BY USER
@api.route('/cart', methods=['GET'])
@jwt_required()
def get_cart():
    user_id = get_jwt_identity()
    cart = db.session.execute(select(Cart).where(
        Cart.user_id == user_id)).scalar_one_or_none()
 
    if not cart:
        return jsonify({"success": False, "msg": "not found"}), 404
 
    items = [item.serialize() for item in cart.cart_items]
    return jsonify({"success": True,
                    "data": {"cart": cart.serialize(),
                             "items": items}}), 200
 
 
# GET ALL CARTS BY ADMIN
@api.route("/cart/all", methods=["GET"])
@jwt_required()
def get_all_carts():
    user_id = get_jwt_identity()
    user = db.session.get(User, user_id)
 
    if user.role != "admin":
        return jsonify({"success": False, "msg": "forbidden"}), 403
 
    carts = db.session.execute(select(Cart)).scalars().all()
    transform = [cart.serialize() for cart in carts]
    return jsonify({"success": True, "data": transform}), 200
 
 
# ADD PRODUCT TO CART BY USER
@api.route('/cart', methods=['POST'])
@jwt_required()
def add_to_cart():
    user_id = get_jwt_identity()
    body = request.get_json()
 
    if not body.get('product_id') or not body.get('quantity'):
        return jsonify({'success': False, 'msg': 'missing data'}), 400
 
    # Buscar o crear carrito
    cart = db.session.execute(select(Cart).where(
        Cart.user_id == user_id)).scalar_one_or_none()
 
    if not cart:
        cart = Cart(user_id=user_id)
        db.session.add(cart)
        db.session.flush()
 
    # Evitar que el producto se repita y sumar cantidad
    existing_item = db.session.execute(select(CartItem).where(
        CartItem.cart_id == cart.id,
        CartItem.product_id == body['product_id']
    )).scalar_one_or_none()
 
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
@api.route('/delete/cart-item/<int:item_id>', methods=['DELETE'])
@jwt_required()
def remove_from_cart(item_id):
    user_id = get_jwt_identity()
 
    item = db.session.get(CartItem, item_id)
 
    cart = db.session.execute(select(Cart).where(
        Cart.user_id == user_id
    )).scalar_one_or_none()
 
    if not cart:
        return jsonify({"success": False, "msg": "Cart not found"}), 404
 
    cart_id = cart.id
 
    if not item:
        return jsonify({"success": False, "msg": "Item not found"}), 404
 
    if item.cart_id != cart_id:
        return jsonify({"success": False, "msg": "This item does not belong to your cart"}), 403
 
    db.session.delete(item)
    db.session.commit()
    return jsonify({"success": True, "data": "Item removed from cart"}), 200