import { Link } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { useNavigate } from "react-router-dom";
import { useState } from 'react';
import "bootstrap-icons/font/bootstrap-icons.css";

export const Cart = () => {
    const navigate = useNavigate()
    const { store, dispatch } = useGlobalReducer()
    const url = import.meta.env.VITE_BACKEND_URL;

    const total = store.cart.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
    );

    const handleBuy = async (product) => {
        try {

            const user_id = store.user?.id;

            if (!user_id) {
                console.error("Usuario no logueado");
                return;
            }

            const res = await fetch(url + "/api/create-checkout-session", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    user_id: store.user.id,
                    products: store.cart,
                }),
            });

            const data = await res.json();

            if (!data.url) {
                console.error("Error creando sesión Stripe", data);
                return;
            }

            window.location.href = data.url;

        } catch (error) {
            console.error("Error en pago:", error);
        }
    };

    return (
        <nav className="navbar navbar-light bg-light container-fluid px-4 d-flex flex-column flex-md-row ">
            <div className="" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
                <img src="" style={{ width: '60px' }}></img>
            </div>
            <div className="">
                <h1>Carrito Api</h1>
            </div>

            <div className="">
                <div className="btn-group">
                    <button
                        className="btn border-0 bg-transparent position-relative p-0"
                        type="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                    >
                        <i className="bi bi-cart3 fs-3"></i>

                        {store.cart.length > 0 && (
                            <span
                                className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                                style={{
                                    fontSize: "0.65rem",
                                    padding: "4px 6px",
                                }}
                            >
                                {store.cart.length}
                            </span>
                        )}
                    </button>

                    <ul className="dropdown-menu dropdown-menu-end p-2 col-12 col-sm-8 col-md-6">

                        {store.cart && store.cart.length > 0 ? (
                            <>
                                {store.cart.map((cartItem, index) => (
                                    <li
                                        key={index}
                                        className="w-100 d-flex justify-content-between align-items-center px-2 gap-2"
                                    >
                                        <span className="flex-grow-1 overflow-hidden">
                                            <div className="text-truncate">
                                                {cartItem.name}
                                            </div>

                                            <div>
                                                <div>
                                                    {cartItem.price} € x {cartItem.quantity}
                                                </div>
                                            </div>
                                        </span>

                                        <span >
                                            <div className="d-flex align-items-center gap-2">

                                                <button
                                                    className="btn btn-sm btn-outline-secondary"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();

                                                        dispatch({
                                                            type: "decreaseQuantity",
                                                            payload: cartItem.id,
                                                        });
                                                    }}
                                                >
                                                    -
                                                </button>

                                                <span>{cartItem.quantity}</span>

                                                <button
                                                    className="btn btn-sm btn-outline-secondary"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();

                                                        dispatch({
                                                            type: "increaseQuantity",
                                                            payload: cartItem.id,
                                                        });
                                                    }}
                                                >
                                                    +
                                                </button>

                                            </div>
                                        </span>
                                    </li>
                                ))}

                                <li>
                                    <hr className="dropdown-divider" />
                                </li>
                                <li className="px-2">
                                    <strong>Total: {total.toFixed(2)} €</strong>
                                </li>
                                <li className="px-2 mt-2">
                                    <button
                                        className="btn btn-success w-100"
                                        onClick={() => handleBuy(store.cart)}
                                    >
                                        Comprar
                                    </button>
                                </li>
                            </>
                        ) : (
                            <li className="dropdown-item text-muted">
                                Start shopping!
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        </nav >
    );
};