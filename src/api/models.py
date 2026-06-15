from datetime import datetime
from decimal import Decimal
from flask_sqlalchemy import SQLAlchemy  # type: ignore
from sqlalchemy import String, Boolean, ForeignKey, DateTime, Numeric, Text, Enum  # type: ignore
from sqlalchemy.orm import Mapped, mapped_column, relationship  # type: ignore
import enum
from sqlalchemy import CheckConstraint

db = SQLAlchemy()


# ENUMS


class DietExerciseType(enum.Enum):
    diet = "diet"
    workout = "workout"


class PaymentStatus(enum.Enum):
    pending = "pending"
    cancelled = "cancelled"
    paid = "paid"
    refunded = "refunded"


# USERS


class User(db.Model):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)

    name: Mapped[str] = mapped_column(String(50), nullable=False)

    email: Mapped[str] = mapped_column(
        String(120), unique=True, nullable=False)

    password: Mapped[str] = mapped_column(String(255), nullable=False)
    # podriamos pasarlo a enum
    role: Mapped[str] = mapped_column(
        String(20), default="user", nullable=False)

    age: Mapped[int] = mapped_column(nullable=True)

    weight: Mapped[float] = mapped_column(nullable=True)

    height: Mapped[float] = mapped_column(nullable=True)

    objective: Mapped[str] = mapped_column(String(50), nullable=True)

    photo: Mapped[str] = mapped_column(String(255), nullable=True)

    is_banned: Mapped[bool] = mapped_column(Boolean, default=False)

    ban_reason: Mapped[str] = mapped_column(Text, nullable=True)

    is_active: Mapped[bool] = mapped_column(
        Boolean, default=True, nullable=False)

    created_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow, nullable=False
    )

    # Relationships
    orders = relationship("Order", back_populates="user")

    subscriptions = relationship("Subscription", back_populates="user")

    myplans = relationship("MyPlan", back_populates="user")

    payments = relationship("Payment", back_populates="user")

    carts = relationship("Cart", back_populates="user")

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "role": self.role,
            "age": self.age,
            "weight": self.weight,
            "height": self.height,
            "objective": self.objective,
            "photo": self.photo,
            "is_banned": self.is_banned,
            "ban_reason": self.ban_reason,
            "is_active": self.is_active,
            "created_at": self.created_at.isoformat(),
        }


# PRODUCTS


class Product(db.Model):
    __tablename__ = "products"

    id: Mapped[int] = mapped_column(primary_key=True)

    name: Mapped[str] = mapped_column(String(100), nullable=False)

    description: Mapped[str] = mapped_column(String(255), nullable=True)

    price: Mapped[Decimal] = mapped_column(Numeric(10, 2), nullable=False)

    stock: Mapped[int] = mapped_column(nullable=False)

    category: Mapped[str] = mapped_column(String(50), nullable=False)

    image: Mapped[str] = mapped_column(String(255), nullable=True)

    # Relationships
    order_items = relationship("OrderItem", back_populates="product")

    cart_items = relationship("CartItem", back_populates="product")

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "price": float(self.price),
            "stock": self.stock,
            "category": self.category,
            "image": self.image,
        }


# ORDERS


class Order(db.Model):
    __tablename__ = "orders"

    id: Mapped[int] = mapped_column(primary_key=True)

    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id"), nullable=False)

    total_price: Mapped[Decimal] = mapped_column(
        Numeric(10, 2), nullable=False)

    status: Mapped[str] = mapped_column(String(20), nullable=False)

    stripe_session_id: Mapped[str] = mapped_column(String(255), nullable=True)

    created_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow, nullable=False
    )

    # Relationships
    user = relationship("User", back_populates="orders")

    payments = relationship("Payment", back_populates="order")

    order_items = relationship("OrderItem", back_populates="order")

    def serialize(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "total_price": float(self.total_price),
            "status": self.status,
            "created_at": self.created_at,
        }


# ORDER ITEMS


class OrderItem(db.Model):
    __tablename__ = "order_items"

    __table_args__ = (
        CheckConstraint(
            "(product_id IS NOT NULL AND subscription_plan_id IS NULL) OR "
            "(product_id IS NULL AND subscription_plan_id IS NOT NULL)",
            name="check_order_item_type",
        ),
    )

    id: Mapped[int] = mapped_column(primary_key=True)

    order_id: Mapped[int] = mapped_column(
        ForeignKey("orders.id"), nullable=False)

    product_id: Mapped[int] = mapped_column(
        ForeignKey("products.id"), nullable=True)

    subscription_plan_id: Mapped[int] = mapped_column(
        ForeignKey("subscription_plans.id"), nullable=True
    )

    quantity: Mapped[int] = mapped_column(nullable=False)

    price: Mapped[Decimal] = mapped_column(Numeric(10, 2), nullable=False)
    # Relationships
    order = relationship("Order", back_populates="order_items")
    subscription_plan = relationship(
        "SubscriptionPlan", back_populates="order_items")
    product = relationship("Product", back_populates="order_items")

    def serialize(self):
        return {
            "id": self.id,
            "order_id": self.order_id,
            "product_id": self.product_id,
            "subscription_plan_id": self.subscription_plan_id,
            "quantity": self.quantity,
            "price": float(self.price),
        }


# SUBSCRIPTION PLANS


class SubscriptionPlan(db.Model):
    __tablename__ = "subscription_plans"

    id: Mapped[int] = mapped_column(primary_key=True)

    name: Mapped[str] = mapped_column(String(255), nullable=False)

    price: Mapped[Decimal] = mapped_column(Numeric(10, 2), nullable=False)

    description: Mapped[str] = mapped_column(Text, nullable=True)

    # Relationships
    subscriptions = relationship("Subscription", back_populates="plan")
    myplans = relationship("MyPlan", back_populates="plan")
    order_items = relationship("OrderItem", back_populates="subscription_plan")

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "price": float(self.price),
            "description": self.description,
        }


# SUBSCRIPTIONS


class Subscription(db.Model):
    __tablename__ = "subscriptions"

    id: Mapped[int] = mapped_column(primary_key=True)

    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id"), nullable=False)

    plan_id: Mapped[int] = mapped_column(
        ForeignKey("subscription_plans.id"), nullable=False
    )

    active: Mapped[bool] = mapped_column(
        Boolean, default=False, nullable=False)

    stripe_subscription_id: Mapped[str] = mapped_column(
        String(255), unique=True, nullable=True
    )

    stripe_customer_id: Mapped[str] = mapped_column(
        String(255), unique=True, nullable=True
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow, nullable=False
    )

    cancel_day: Mapped[datetime] = mapped_column(DateTime, nullable=True)

    # Relationships
    user = relationship("User", back_populates="subscriptions")

    plan = relationship("SubscriptionPlan", back_populates="subscriptions")

    payments = relationship("Payment", back_populates="subscription")

    def serialize(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "plan_id": self.plan_id,
            "active": self.active,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "cancel_day": self.cancel_day.isoformat() if self.cancel_day else None,
        }


# MYPLANS


class MyPlan(db.Model):
    __tablename__ = "myplans"

    id: Mapped[int] = mapped_column(primary_key=True)

    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id"), nullable=False)
    plan_id: Mapped[int] = mapped_column(
        ForeignKey("subscription_plans.id"), nullable=False
    )
    tipo_plan: Mapped[DietExerciseType] = mapped_column(
        Enum(DietExerciseType), nullable=True
    )
    plan_data: Mapped[dict] = mapped_column(db.JSON(), nullable=True)
    # Relationships
    user = relationship("User", back_populates="myplans")
    plan = relationship("SubscriptionPlan", back_populates="myplans")

    def serialize(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "plan_id": self.plan_id,
            "tipo_plan": self.tipo_plan.value if self.tipo_plan else None,
            "plan_data": getattr(self, "plan_data", None),
        }


# PAYMENTS


class Payment(db.Model):
    __tablename__ = "payments"

    id: Mapped[int] = mapped_column(primary_key=True)

    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id"), nullable=False)

    order_id: Mapped[int] = mapped_column(
        ForeignKey("orders.id"), nullable=True)

    subscription_id: Mapped[int] = mapped_column(
        ForeignKey("subscriptions.id"), nullable=True
    )

    amount: Mapped[Decimal] = mapped_column(Numeric(10, 2), nullable=False)

    payment_method: Mapped[str] = mapped_column(String(50), nullable=False)

    status: Mapped[PaymentStatus] = mapped_column(
        Enum(PaymentStatus), default=PaymentStatus.pending, nullable=False
    )

    stripe_session_id: Mapped[str] = mapped_column(
        String(255), unique=True, nullable=True
    )

    stripe_invoice_id: Mapped[str] = mapped_column(
        String(255), unique=True, nullable=True
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow, nullable=False
    )

    # Relationships
    user = relationship("User", back_populates="payments")

    order = relationship("Order", back_populates="payments")

    subscription = relationship("Subscription", back_populates="payments")

    def serialize(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "order_id": self.order_id,
            "subscription_id": self.subscription_id,
            "amount": float(self.amount),
            "payment_method": self.payment_method,
            "status": self.status.value,
            "stripe_session_id": self.stripe_session_id,
            "stripe_invoice_id": self.stripe_invoice_id,
            "created_at": self.created_at,
        }


# CARTS


class Cart(db.Model):
    __tablename__ = "carts"

    id: Mapped[int] = mapped_column(primary_key=True)

    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id"), nullable=False, unique=False
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow, nullable=False
    )

    # Relationships
    user = relationship("User", back_populates="carts")

    cart_items = relationship(
        "CartItem", back_populates="cart", cascade="all, delete-orphan"
    )

    def serialize(self):
        return {"id": self.id, "user_id": self.user_id, "created_at": self.created_at}


# CART ITEMS


class CartItem(db.Model):
    __tablename__ = "cart_items"

    id: Mapped[int] = mapped_column(primary_key=True)

    cart_id: Mapped[int] = mapped_column(
        ForeignKey("carts.id"), nullable=False)

    product_id: Mapped[int] = mapped_column(
        ForeignKey("products.id"), nullable=False)

    quantity: Mapped[int] = mapped_column(nullable=False)

    # Relationships
    cart = relationship("Cart", back_populates="cart_items")

    product = relationship("Product", back_populates="cart_items")

    def serialize(self):
        return {
            "id": self.id,
            "cart_id": self.cart_id,
            "product_id": self.product_id,
            "quantity": self.quantity,
        }
