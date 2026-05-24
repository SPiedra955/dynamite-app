import { Link } from "react-router-dom";

export const Navbar = () => {

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

			<div className="collapse navbar-collapse" id="navbarMenu">
			<div className="navbar-nav ms-auto d-flex gap-5 align-items-center">
				<Link to="/Planes_de_suscripcion" className="nav-link text-light">Planes</Link>
				<Link to="/Tienda" className="nav-link text-light">Tienda</Link>
				<Link to="/authentication">
					<button className="btn btn-danger rounded-pill px-5">Login</button>
				</Link>
			</div>
			</div>

		</div>
		</nav>
	);
};