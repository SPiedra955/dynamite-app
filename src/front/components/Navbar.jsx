import { Link } from "react-router-dom";
import { HashLink } from "react-router-hash-link";
import { useState } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { useNavigate } from "react-router-dom";
import services from "../services/apiServices";
import Swal from "sweetalert2";

export const Navbar = () => {
	const navigate = useNavigate();
	const { store, dispatch } = useGlobalReducer();
	const url = import.meta.env.VITE_BACKEND_URL;
	const token = localStorage.getItem("token");

	const [openCart, setOpenCart] = useState(false);

	const total = store.cart.reduce(
		(acc, item) => acc + item.price * item.quantity,
		0
	);

	const handleBuy = async () => {
		try {
			if (!token) {
				Swal.fire({
					icon: "warning",
					title: "Debes iniciar sesión",
					text: "Inicia sesión para continuar con la compra",
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
					products: store.cart.map((item) => ({
						id: item.id,
						quantity: item.quantity,
					})),
				}),
			});

			const data = await res.json();

			if (data.url) window.location.href = data.url;
		} catch (error) {
			console.error(error);
		}
	};

	const closeSession = () => {
		services.logout();
		navigate("/");
	};

	const initials = store.user?.name
		? store.user.name.charAt(0).toUpperCase()
		: "U";

	const avatarUrl = store.user?.photo;

	return (
		<nav className="fixed top-0 left-0 w-full bg-black/90 backdrop-blur-md z-50">
			<div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3" id="home">

				{/* Logo */}
				<HashLink to="/#home">
					<img
						src="https://res.cloudinary.com/dr5mzsq8w/image/upload/f_auto,q_auto/v1/usuarios_web/bkfknqisgmisx4qeaqqg"
						className="h-10"
					/>
				</HashLink>

				{/* Links */}
				<div className="flex items-center gap-8 text-white font-medium no-underline !important">

					<HashLink to="/#plans" className="text-white hover:text-red-500 no-underline !important">
						Planes
					</HashLink>

					<Link to="/products" className="text-white hover:text-red-500 no-underline">
						Tienda
					</Link>

					{/* Carrito */}
					<div className="relative">
						<button onClick={() => setOpenCart(!openCart)} className="relative">
							🛒
							{store.cart.length > 0 && (
								<span className="absolute -top-2 -right-2 bg-red-500 text-xs px-1 rounded-full">
									{store.cart.length}
								</span>
							)}
						</button>

						{openCart && (
							<div className="absolute right-0 mt-2 w-80 bg-white text-black rounded-lg shadow-lg p-3">
								{store.cart.length > 0 ? (
									<>
										{store.cart.map((item) => (
											<div
												key={item.id}
												className="flex justify-between items-center mb-2"
											>
												<div>
													<p className="font-semibold">{item.name}</p>
													<p className="text-sm text-gray-500">
														{item.price}€ x {item.quantity}
													</p>
												</div>

												<div className="flex gap-2 items-center">
													<button
														onClick={() =>
															dispatch({
																type: "decreaseQuantity",
																payload: item.id,
															})
														}
													>
														-
													</button>

													<span>{item.quantity}</span>

													<button
														onClick={() =>
															dispatch({
																type: "increaseQuantity",
																payload: item.id,
															})
														}
													>
														+
													</button>
												</div>
											</div>
										))}

										<hr />

										<div className="flex justify-between font-bold mt-2">
											<span>Total</span>
											<span>{total.toFixed(2)}€</span>
										</div>

										<button
											onClick={handleBuy}
											className="w-full bg-green-600 text-white mt-3 py-2 rounded"
										>
											Comprar
										</button>
									</>
								) : (
									<p className="text-center text-gray-500">
										Carrito vacío
									</p>
								)}
							</div>
						)}
					</div>

					{/* Login / Avatar */}
					{!token ? (
						<Link
							to="/authentication"
							className="bg-red-600 px-4 py-2 rounded-full text-white no-underline"
						>
							Login
						</Link>
					) : (
						<div className="relative group">
							<div className="w-9 h-9 rounded-full overflow-hidden bg-red-500 flex items-center justify-center">
								{avatarUrl ? (
									<img src={avatarUrl} className="w-full h-full object-cover" />
								) : (
									<span className="text-white">{initials}</span>
								)}
							</div>

							<div className="absolute right-0 mt-2 hidden group-hover:block bg-white text-black rounded shadow p-2 w-40">
								<Link to="/profile" className="block p-1 hover:bg-gray-100">
									Mi perfil
								</Link>

								<button
									onClick={closeSession}
									className="block w-full text-left p-1 text-red-500 hover:bg-gray-100"
								>
									Cerrar sesión
								</button>
							</div>
						</div>
					)}

				</div>
			</div>
		</nav>
	);
};