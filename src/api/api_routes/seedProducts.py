# api/services/product_seed_service.py
import pandas as pd
from flask import Flask, request, jsonify  # type: ignore
from api.models import db, User, Product, Order, OrderItem, SubscriptionPlan, Subscription, Payment, Cart, CartItem
from sqlalchemy import select  # type: ignore

def seed_products_from_csv(path: str):

    df = pd.read_csv(path)

    products = []

    for _, row in df.iterrows():

        product = Product(
            name=row["product_name"],
            description=row["product_description"],
            price=row["price"],
            stock=100,
            category=row["product_category"],
            image="src/front/assets/img/article.jpg"
        )

        products.append(product)

    db.session.bulk_save_objects(products)
    db.session.commit()

    return len(products)
