import { Link } from "react-router-dom";

export const Plans = () => (
  <div className="bg-danger w-100 py-5">
    <div className="container py-5">

      <h1 className="text-white fw-bold mb-4 fs-3 fs-md-1">Nuestros planes</h1>

      <div className="row g-4">

        {/* Dietas a medida */}
        <div className="col-12 col-md-4">
          <div className="bg-dark rounded-4 p-4 h-100 d-flex flex-column">
            <h2 className="text-white text-center mb-4 fs-4 fs-md-2">Dietas a medida</h2>
            <p className="text-white">
              Rellena nuestra encuesta y obten una dieta 100% a medida para conseguir los resultados que deseas.
            </p>
            <ul className="list-unstyled text-white flex-grow-1 mt-3">
              <li className="mb-3"><span className="text-danger fw-bold me-2">✓</span>Dieta 100% a medida</li>
              <li className="mb-3"><span className="text-danger fw-bold me-2">✓</span>Platos variados y faciles de preparar</li>
              <li className="mb-3"><span className="text-danger fw-bold me-2">✓</span>Sólo ingredientes de calidad nutritiva</li>
              <li className="mb-3"><span className="text-danger fw-bold me-2">✓</span>Lista de la compra</li>
              <li className="mb-3"><span className="text-danger fw-bold me-2">✓</span>Resultados en menos de 4 semanas</li>
            </ul>
            <div className="text-center mt-4">
              <p className="text-white fw-bold fs-5">Precio: 6,90€</p>
              <Link to="/subscription_plans">
                <button className="btn btn-danger rounded-pill px-5">Comprar</button>
              </Link>
            </div>
          </div>
        </div>

        {/* Rutina personalizada */}
        <div className="col-12 col-md-4">
          <div className="bg-dark rounded-4 p-4 h-100 d-flex flex-column">
            <h2 className="text-white text-center mb-4 fs-4 fs-md-2">Rutina personalizada</h2>
            <p className="text-white">
              Dependiendo de tus objetivos y tu estado inicial prepararemos una rutina a medida para que consigas los resultados deseados.
            </p>
            <ul className="list-unstyled text-white flex-grow-1 mt-3">
              <li className="mb-3"><span className="text-danger fw-bold me-2">✓</span>Rutina 100% a medida</li>
              <li className="mb-3"><span className="text-danger fw-bold me-2">✓</span>Ejercicios variados y fáciles de realizar</li>
              <li className="mb-3"><span className="text-danger fw-bold me-2">✓</span>Movimientos y pesos con los que puedes trabajar</li>
              <li className="mb-3"><span className="text-danger fw-bold me-2">✓</span>Te sentirás mejor desde la primera semana</li>
              <li className="mb-3"><span className="text-danger fw-bold me-2">✓</span>Resultados notables en menos de 2 meses</li>
            </ul>
            <div className="text-center mt-4">
              <p className="text-white fw-bold fs-5">Precio: 6,90€</p>
              <Link to="/subscription_plans">
                <button className="btn btn-danger rounded-pill px-5">Comprar</button>
              </Link>
            </div>
          </div>
        </div>

        {/* Combo dieta + rutina */}
        <div className="col-12 col-md-4">
          <div className="bg-dark rounded-4 p-4 h-100 d-flex flex-column">
            <h2 className="text-white text-center mb-4 fs-4 fs-md-2">Combo dieta + rutina</h2>
            <p className="text-white">
              ¡Combinación explosiva! Cambiar tus hábitos alimenticios combinados con una rutina de ejercicio 100% enfocada en tus objetivos te llevará al siguiente nivel en muy poco tiempo.
            </p>
            <ul className="list-unstyled text-white flex-grow-1 mt-3">
              <li className="mb-3"><span className="text-danger fw-bold me-2">✓</span>Rutina 100% personalizada</li>
              <li className="mb-3"><span className="text-danger fw-bold me-2">✓</span>Ejercicios variados</li>
              <li className="mb-3"><span className="text-danger fw-bold me-2">✓</span>Movimientos y pesos con los que puedes trabajar</li>
              <li className="mb-3"><span className="text-danger fw-bold me-2">✓</span>Dieta a medida</li>
              <li className="mb-3"><span className="text-danger fw-bold me-2">✓</span>Platos variados y fáciles de preparar</li>
              <li className="mb-3"><span className="text-danger fw-bold me-2">✓</span>Sólo ingredientes de calidad nutritiva</li>
              <li className="mb-3"><span className="text-danger fw-bold me-2">✓</span>Lista de la compra</li>
            </ul>
            <div className="text-center mt-4">
              <p className="text-white fw-bold fs-5">Precio: 9,90€</p>
              <Link to="/subscription_plans">
                <button className="btn btn-danger rounded-pill px-5">Comprar</button>
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
);