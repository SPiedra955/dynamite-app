from flask import Flask, request, jsonify
from api.models import db, User, Product, Order, OrderItem, SubscriptionPlan, Subscription, Payment, Cart, CartItem, MyPlan, DietExerciseType,PaymentStatus
from sqlalchemy import select
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required
from api.blueprint import api
from werkzeug.security import generate_password_hash
from datetime import datetime


# ── PEDIDOS ───────────────────────────────────────────────────────────────────

# GET ALL ORDERS

@api.route("/orders", methods=['GET'])
def get_orders():
    orders = db.session.execute(select(Order)).scalars().all()
    transform = [order.serialize() for order in orders]
    return jsonify({"success": True, "data": transform}), 200

# ONE ORDER


@api.route('/orders/<int:user_id>', methods=['GET'])
def get_user_orders(user_id):
    orders = db.session.execute(select(Order).where(
        Order.user_id == user_id)).scalars().all()
    transform = [order.serialize() for order in orders]
    return jsonify({"success": True, "data": transform}), 200

# CREATE ORDER FOR CART


@api.route('/orders', methods=['POST'])
def create_order():
    body = request.get_json()
#  comprueba el user_id
    if not body['user_id']:
        return jsonify({"success": False, "msg": "missing data"}), 403
# buscar carrito usuario
    cart = db.session.execute(
        select(Cart).where(Cart.user_id == body['user_id'])
    ).scalar_one_or_none()

    if not cart or not cart.cart_items:
        return jsonify({"success": False, "msg": "cart is empty"}), 400
# Recorre los items del carrito y calcula el total
    total = 0
    order_items = []
    for item in cart.cart_items:
        product = db.session.get(Product, item.product_id)
# Comprueba que hay stock suficiente
        if product.stock < item.quantity:
            return jsonify({
                "success": False,
                "msg": f"not enough stock for {product.name}"
            }), 400
        subtotal = float(product.price) * item.quantity
        total += subtotal
        order_items.append({"product": product,
                            "quantity": item.quantity,
                            "price": float(product.price)})


#  Crea el pedido con el total calculado
        new_order = Order(
            user_id=body['user_id'],
            total_price=total,
            status="pending")
        db.session.add(new_order)
        db.session.flush()
#  crea los order items y quita del stock
        for item_data in order_items:
            order_item = OrderItem(
                order_id=new_order.id,
                product_id=item_data['product'].id,
                quantity=item_data['quantity'],
                price=item_data['price']
            )
        item_data['product'].stock -= item_data['quantity']
        db.session.add(order_item)

        for item in cart.cart_items:
            db.session.delete(item)

        db.session.commit()

        return jsonify({"success": True, "data": new_order.serialize()}), 200
