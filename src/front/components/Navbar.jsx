import { Link } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { useNavigate } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";
import { HashLink } from 'react-router-hash-link';
import services from "../services/apiServices";
import Swal from "sweetalert2";

export const Navbar = () => {

	const navigate = useNavigate();
	const { store, dispatch } = useGlobalReducer();
	const url = import.meta.env.VITE_BACKEND_URL;
	const token = localStorage.getItem("token");

	const total = store.cart.reduce(
		(acc, item) => acc + item.price * item.quantity,
		0
	);

	const handleBuy = async (product) => {
		try {
			if (!token) {
				Swal.fire({
					icon: "warning",
					title: "Debes iniciar sesión",
					text: "Inicia sesión para continuar con la compra",
					confirmButtonColor: "#dc3545",
				});
				return;
			}

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

	const closeSession = () => {
		services.logout();
		navigate("/");
	};

	// Iniciales del usuario para el avatar cuando no hay foto
	const initials = store.user?.name
		? store.user.name.charAt(0).toUpperCase()
		: "U";

	// Foto de perfil si existe en el store
	const avatarUrl = store.user?.profile_image || null;

	return (
		<nav className="navbar navbar-expand-lg navbar-dark position-fixed top-0 start-0 w-100"
			style={{ backgroundColor: "rgba(0, 0, 0, 0.8)", zIndex: 10 }}>
			<div className="container">

				<Link to="/" className="navbar-brand">
					<img
						src="https://res.cloudinary.com/dr5mzsq8w/image/upload/f_auto,q_auto/v1/usuarios_web/bkfknqisgmisx4qeaqqg"
						alt="Logo"
						style={{ height: "40px" }}
					/>
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

				<div className="collapse navbar-collapse" id="navbarMenu">
					<div className="navbar-nav ms-auto align-items-lg-center gap-lg-4">

						<HashLink to="/#plans" className="nav-link text-light">
							Planes
						</HashLink>

						<Link to="/products" className="nav-link text-light">
							Tienda
						</Link>

						{/* Carrito */}
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
										className="position-absolute start-100 translate-middle badge rounded-pill bg-danger"
										style={{ fontSize: "0.65rem", top: "8px" }}
									>
										{store.cart.length}
									</span>
								)}
							</button>

							<ul className="dropdown-menu dropdown-menu-end p-3" style={{ minWidth: "320px", maxWidth: "400px" }}>
								{store.cart?.length > 0 ? (
									<>
										{store.cart.map((cartItem) => (
											<li key={cartItem.id} className="d-flex justify-content-between align-items-center gap-3 mb-3">
												<div className="flex-grow-1">
													<div className="fw-semibold text-truncate">{cartItem.name}</div>
													<small className="text-muted">{cartItem.price} € x {cartItem.quantity}</small>
												</div>
												<div className="d-flex align-items-center gap-2">
													<button className="btn btn-sm btn-outline-secondary"
														onClick={(e) => { e.preventDefault(); e.stopPropagation(); dispatch({ type: "decreaseQuantity", payload: cartItem.id }); }}>
														-
													</button>
													<span>{cartItem.quantity}</span>
													<button className="btn btn-sm btn-outline-secondary"
														onClick={(e) => { e.preventDefault(); e.stopPropagation(); dispatch({ type: "increaseQuantity", payload: cartItem.id }); }}>
														+
													</button>
												</div>
											</li>
										))}
										<li><hr className="dropdown-divider" /></li>
										<li className="d-flex justify-content-between mb-3">
											<strong>Total</strong>
											<strong>{total.toFixed(2)} €</strong>
										</li>
										<li>
											<button className="btn btn-success w-100" onClick={() => handleBuy(store.cart)}>
												Comprar
											</button>
										</li>
									</>
								) : (
									<li className="text-muted text-center py-2">Start shopping!</li>
								)}
							</ul>
						</div>

						{/* Login / Avatar usuario */}
						{token == null ? (
							<Link to="/authentication" className="btn btn-danger rounded-pill px-4 mt-3 mt-lg-0">
								Login
							</Link>
						) : (
							<div className="dropdown mt-3 mt-lg-0">
								<button
									className="btn p-0 border-0 bg-transparent"
									type="button"
									data-bs-toggle="dropdown"
									aria-expanded="false"
								>
									{avatarUrl ? (
										<img
											src={avatarUrl}
											alt="Perfil"
											className="rounded-circle object-fit-cover border border-danger border-2"
											style={{ width: 38, height: 38 }}
										/>
									) : (
										<div
											className="rounded-circle bg-danger d-flex align-items-center justify-content-center text-white fw-bold border border-danger border-2"
											style={{ width: 38, height: 38, fontSize: 15 }}
										>
											{initials}
										</div>
									)}
								</button>

								<ul className="dropdown-menu dropdown-menu-end">
									<li>
										<span className="dropdown-item-text text-muted small">
											{store.user?.name || "Usuario"}
										</span>
									</li>
									<li><hr className="dropdown-divider" /></li>
									<li>
										<Link to="/perfil" className="dropdown-item">
											<i className="bi bi-person me-2"></i>
											Mi perfil
										</Link>
									</li>
									<li>
										<button className="dropdown-item text-danger" onClick={closeSession}>
											<i className="bi bi-box-arrow-right me-2"></i>
											Cerrar sesión
										</button>
									</li>
								</ul>
							</div>
						)}

					</div>
				</div>
			</div>
		</nav>
	);
};