import { Link } from "react-router-dom";

export const Navbar = () => {

	return (
		<nav className="navbar navbar-expand-lg navbar-dark bg-dark">
			<div className="container">
				
				{/* Logo */}
				<Link to="/" className="navbar-brand fw-bold">
					React Boilerplate
				</Link>

				{/* Botón hamburguesa */}
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

				{/* Contenido colapsable */}
				<div className="collapse navbar-collapse" id="navbarMenu">

					{/* Empuja todo hacia la derecha */}
					<div className="navbar-nav ms-auto d-flex gap-3 align-items-center">
						<Link to="/" className="nav-link pe-5 text-light">Planes</Link>
						<Link to="/" className="nav-link pe-5 text-light">Tienda</Link>

						{/* Botón login */}
						<Link to="/authentication">
							<button className="btn btn-danger rounded-pill px-5">
								Login
							</button>
						</Link>
					</div>

				</div>
			</div>
		</nav>
	);
};