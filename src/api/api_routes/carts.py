from flask import Flask, request, jsonify
from api.models import db, User, Product, Order, OrderItem, SubscriptionPlan, Subscription, Payment, Cart, CartItem
from sqlalchemy import select
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required
from api.blueprint import api
from werkzeug.security import generate_password_hash
from datetime import datetime

# GET ALL USERS


@api.route("/users", methods=['GET'])
def get_all_users():
    users = db.session.execute(select(User)).scalars().all()
    transform = [user.serialize() for user in users]
    return jsonify({"success": True, "data": transform}), 200

# CREATE NEW USER


@api.route("/users", methods=['POST'])
def new_user():
    body = request.get_json()
    if not body['name'] or not body["email"] or not body['password'] or not body['age'] or not body['weight'] or not body['height'] or not body['objective'] or not body['photo']:
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

# UPDATE USER


@api.route("/update/user/<int:id>", methods=['PUT'])
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

    db.session.commit()

    return jsonify({"success": True, "data": user.serialize()})

# DELETE USER


@api.route("/delete/user/<int:id>", methods=['DELETE'])
def delete_user(id):

    user = db.session.get(User, id)

    if not user:
        return jsonify({"success": False, "msg": "not found"}), 404

    db.session.delete(user)
    db.session.commit()
    return jsonify({"success": True, "data": "user deleted " + str(id)}), 200


# GET USER ID

@api.route("/user/<int:id>", methods=['GET'])
def get_one_user(id):
    user = db.session.get(User, id)

    if not user:
        return jsonify({"success": False, "msg": "not found"}), 404

    return jsonify({"success": True, "data": user.serialize()}), 200


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
# ── PLANES DE SUSCRIPCIÓN ─────────────────────────────────────────────────────

@api.route('/subscription-plans', methods=['GET'])

def get_subscription_plans():
    plans= db.session.execute(select(SubscriptionPlan)).scalars().all()
    transform = [plan.serialize() for plan in plans]
    return jsonify({"success": True, "data": transform}), 200




# GET SUBSCRIPTION PLAN
@api.route('/subscription-plans/<int:user_id>', methods=['GET'])
def get_subscription_plan(plan_id):
    plan = db.session.get(SubscriptionPlan,plan_id)

    if not plan:
         return jsonify({"success": False, "msg": "not found"}), 404
 
    return jsonify({"success": True, "data": plan.serialize()}), 200

# CREATE SUBSCRIPTION PLAN
@api.route('/subscription-plans',methods=['POST'])

def create_subscription_plan():
    body=request.get_json():

    if not body['name'] or not body ['price']:
        return jsonify({"sucess":True, "msg":"missing data"}), 403
    
    new_plan= SubscriptionPlan(
        name=body['name'],
        price=body['price'],
        description=body.get('description')
    )
    db.session.add(new_plan)
    db.session.commit()
    return jsonify({"sucess":True,"data": new_plan.serialize()}),200

# UPDATE SUBSCRIPTION PLAN 
@api.route ('/update/subscription-plan/<int:plan_id>',methods=['PUT'])
def update_subscription_plan(plan_id):
    plan= db.session.get(SubscriptionPlan,plan_id)

    if not plan:
         return jsonify({"success": False, "msg": "not found"}), 404
    
    body=request.get_json()
    plan.name = body.get('name', plan.name)
    plan.price = body.get('price',plan.price)
    plan.description = body.get ('description', plan.description)

    db.session.commit()
    return jsonify ({"success": True, "data": plan.serialize()}), 200

# DELETE SUBS PLAN

@api.route('/delete/subscripton-plan/<int:item_id>', methods=['DELETE'])
def delete_subscription_plan(plan_id):
    plan = db.session.get(SubscriptionPlan, plan_id)

    if not plan:
        return jsonify({"success": False, "msg": "not found"}), 404

    db.session.delete(plan)
    db.session.commit()
    return jsonify({"success": True, "data": "user deleted " + str(plan_id)}), 200

# ── SUSCRIPCIONES ─────────────────────────────────────────────────────────────

# GET ALL SUBSCRIPTIONS
@api.route('/subscriptions', methods=['GET'])

def get_subscriptions():
    subs= db.session.execute(select(SubscriptionPlan)).scalars().all()
    transform = [sub.serialize() for sub in subs]
    return jsonify({"success": True, "data": transform}), 200

# GET SUBSCRIPTIONS BY USER 

@api.route('/orders/<int:user_id>', methods=['GET'])
def get_user_orders(user_id):
# execute() porque buscamos por user_id que NO es la primary key
    subs = db.session.execute(select(Subscription).where(
        Subscription.user_id == user_id)).scalars().all()
    transform = [sub.serialize() for sub in subs]
    return jsonify({"success": True, "data": transform}), 200

# CREATE SUBSCRIPTION
@api.route('/subscriptions', methods=['POST'])
def create_subscription():
    body = request.get_json()

    if  not body['user_id'] or not body ['plan_id']:
        return jsonify ({"success": False, "msg": "missing data"}), 403
    
    plan = db.session.get (SubscriptionPlan,body['plan_id'])

    if not plan:
        return jsonify ({"success": False, "msg": "plan not found"}), 404
    # Buscamos en la tabla subscriptions
    create = db.session.execute(select(Subscription).where(Subscription.user_id== body['user_id'],
                                                           Subscription.active==True)).scalar_one_or_none() 
    # # devuelve un objeto o None si no encuentra nada
                                                           
    if create:
        return jsonify({"success":False,"msg": "already has an active subscription"}),400

    new_subscription = Subscription(
        user_id=body['user_id'],
        plan_id =body ['`plan_id'],
        active = True
    )
    db.session.add(new_subscription)
    db.session.commit ()
    return jsonify({"sucess":True,"data": new_subscription.serialize()}),200 


# CANCEL SUBSCRIPTION

@api.route('/cancel/subscription/<int:subscription_id>',methods=['PUT'])
def cancel_subscription(subscription_id):
    subscription= db.session.get (Subscription,subscription_id)
    if not subscription:
        return jsonify ({"success": False, "msg": "not found"}), 404
    subscription.active = False
    subscription.cancel_day = datetime.utcnow()

    db.session.commit ()
    return jsonify({"success": True, "data": subscription.serialize()}), 200