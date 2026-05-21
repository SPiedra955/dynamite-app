export const Footer = () => (
	<footer className="footer mt-auto py-4 bg-dark">
  <div className="container">
    <div className="row text-center text-md-start">
      {/* Primera columna: Logo (Ocupa ancho completo en móvil, 3 columnas de 12 en pantallas medianas y superiores) */}
      <div className="col-12 col-md-3 mb-4 mb-md-0">
        <p className="text-light fw-bold fs-4">
          <a href="#" className="text-white text-decoration-none">LOGO</a>
        </p>
      </div>
    
      {/* Segunda columna: Enlaces principales */}
      <div className="col-12 col-sm-4 col-md-3 mb-4 mb-md-0">
        <p className="text-light mb-2">
          <a href="#" className="text-white text-decoration-none">Tienda</a>
        </p>
        <p className="text-light mb-2">
          <a href="#" className="text-white text-decoration-none">Planes</a>
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
        <p className="text-light mb-2">
          <a href="#" className="text-white text-decoration-none">Instagram</a>
        </p>
        <p className="text-light mb-2">
          <a href="#" className="text-white text-decoration-none">Facebook</a>
        </p>
        <p className="text-light mb-2">
          <a href="#" className="text-white text-decoration-none">Youtube</a>
        </p>
      </div>			
      
      {/* Quinta sección: Derechos reservados (Ocupa las 12 columnas en cualquier tamaño de pantalla) */}
      <div className="col-12 text-center mt-4 pt-3 border-top border-secondary">		
        <p className="text-light small mb-0">
          Derechos reservados DYNAMITE APP 2026. Final Proyect <a href="http://www.4geeksacademy.com" className="text-white text-decoration-none">4Geeks Academy</a>.
        </p>
      </div>
    </div>
  </div>
</footer>

);
