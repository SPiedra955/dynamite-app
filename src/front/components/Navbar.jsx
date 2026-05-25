import { Link } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { useNavigate } from "react-router-dom";
import { useState } from 'react';
import "bootstrap-icons/font/bootstrap-icons.css";

export const Navbar = () => {


	const navigate = useNavigate()
	const { store, dispatch } = useGlobalReducer()
	const url = import.meta.env.VITE_BACKEND_URL;
	const token = localStorage.getItem("token")

	const total = store.cart.reduce(
		(acc, item) => acc + item.price * item.quantity,
		0
	);

	const handleBuy = async (product) => {
		try {

			const res = await fetch(`${url}/api/create-checkout-session`, {
				method: "POST",
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					email: store.user.email,
					products: store.cart.map(item => ({
						id: item.id,
						quantity: item.quantity
					}))
				})
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
		<nav className="navbar navbar-expand-lg navbar-dark position-absolute w-100" 
  	style={{ backgroundColor: "rgba(0, 0, 0, 0.8)", zIndex: 10 }}>	
  			<div className="container">
    
			<Link to="/" className="navbar-brand fw-bold">
			React Boilerplate
			</Link>

			<button
			className="navbar-toggler"
			type="button"
			data-bs-toggle="collapse"
			data-bs-target="#navbarMenu"
			aria-controls="navbarMenu"
			aria-expanded="false"
			aria-label="Toggle navigation"
			>
			<span className="navbar-toggler-icon"></span>
			</button>

				{/* Menu */}
				<div className="collapse navbar-collapse" id="navbarMenu">

					{/* Links */}
					<div className="navbar-nav ms-auto align-items-lg-center gap-lg-4">

						<Link
							to="/"
							className="nav-link text-light"
						>
							Planes
						</Link>

						<Link
							to="/products"
							className="nav-link text-light"
						>
							Tienda
						</Link>

						{/* Cart */}
						<div className="dropdown">

							<button
								className="btn border-0 bg-transparent position-relative text-light"
								type="button"
								data-bs-toggle="dropdown"
								aria-expanded="false"
							>
								<i className="bi bi-cart3 fs-4"></i>

								{store.cart.length > 0 && (
									<span
										className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
										style={{
											fontSize: "0.65rem",
										}}
									>
										{store.cart.length}
									</span>
								)}
							</button>

							<ul
								className="dropdown-menu dropdown-menu-end p-3"
								style={{
									minWidth: "320px",
									maxWidth: "400px",
								}}
							>

								{store.cart?.length > 0 ? (
									<>
										{store.cart.map((cartItem) => (
											<li
												key={cartItem.id}
												className="d-flex justify-content-between align-items-center gap-3 mb-3"
											>

												<div className="flex-grow-1">
													<div className="fw-semibold text-truncate">
														{cartItem.name}
													</div>

													<small className="text-muted">
														{cartItem.price} € x {cartItem.quantity}
													</small>
												</div>

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
											</li>
										))}

										<li>
											<hr className="dropdown-divider" />
										</li>

										<li className="d-flex justify-content-between mb-3">
											<strong>Total</strong>
											<strong>{total.toFixed(2)} €</strong>
										</li>

										<li>
											<button
												className="btn btn-success w-100"
												onClick={() => handleBuy(store.cart)}
											>
												Comprar
											</button>
										</li>
									</>
								) : (
									<li className="text-muted text-center py-2">
										Start shopping!
									</li>
								)}

							</ul>
						</div>

						{/* Login */}
						<Link
							to="/authentication"
							className="mt-3 mt-lg-0"
						>
							<button className="btn btn-danger rounded-pill px-4">
								Login
							</button>
						</Link>

					</div>
				</div>
			</div>
		</nav>
	);
};