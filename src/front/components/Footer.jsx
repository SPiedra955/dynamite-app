import { Link } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";

export const Footer = () => (
  <footer className="footer mt-auto py-4 bg-black">
    <div className="container">
      <div className="row text-center text-md-start">

        {/* Primera columna: Logo */}
        <div className="col-12 col-md-3 mb-4 mb-md-0 d-flex justify-content-center justify-content-md-start">
          <Link to="/">
            <img 
              src="https://res.cloudinary.com/dr5mzsq8w/image/upload/f_auto,q_auto/v1/usuarios_web/bkfknqisgmisx4qeaqqg" 
              alt="Logo Dynamite" 
              style={{ height: "50px" }}
            />
          </Link>
        </div>

        {/* Segunda columna: Enlaces principales */}
        <div className="col-12 col-sm-4 col-md-3 mb-4 mb-md-0">
          <p className="text-light mb-2">
            <Link to="/products" className="text-white text-decoration-none">Tienda</Link>
          </p>
          <p className="text-light mb-2">
            <Link to="/planes_de_suscripcion" className="text-white text-decoration-none">Planes</Link>
          </p>
          <p className="text-light mb-2">
            <a href="#" className="text-white text-decoration-none">Nosotros</a>
          </p>
        </div>

        {/* Tercera columna: Soporte / Legal */}
        <div className="col-12 col-sm-4 col-md-3 mb-4 mb-md-0">
          <p className="text-light mb-2">
            <a href="#" className="text-white text-decoration-none">Aviso legal</a>
          </p>
          <p className="text-light mb-2">
            <a href="#" className="text-white text-decoration-none">Preguntas Frecuentes</a>
          </p>
          <p className="text-light mb-2">
            <a href="#" className="text-white text-decoration-none">Contacto</a>
          </p>
        </div>

        {/* Cuarta columna: Redes Sociales */}
        <div className="col-12 col-sm-4 col-md-3 mb-4 mb-md-0">
          <div className="d-flex gap-3 justify-content-center justify-content-md-start">
            <a href="https://www.instagram.com" target="_blank" rel="noreferrer" className="text-white fs-4">
              <i className="bi bi-instagram"></i>
            </a>
            <a href="https://www.facebook.com" target="_blank" rel="noreferrer" className="text-white fs-4">
              <i className="bi bi-facebook"></i>
            </a>
            <a href="https://www.youtube.com" target="_blank" rel="noreferrer" className="text-white fs-4">
              <i className="bi bi-youtube"></i>
            </a>
          </div>
        </div>

        {/* Derechos reservados */}
        <div className="col-12 text-center mt-4 pt-3 border-top border-secondary">
          <p className="text-light small mb-0">
            Derechos reservados DYNAMITE APP 2026. Final Proyect <a href="http://www.4geeksacademy.com" className="text-white text-decoration-none">4Geeks Academy</a>.
          </p>
        </div>

      </div>
    </div>
  </footer>
);