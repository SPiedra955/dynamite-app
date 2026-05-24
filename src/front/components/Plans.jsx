export const Plans = () => (

<div className="bg-danger w-100 py-5">
  <div className="container">

    {/* Título */}
    <h1 className="text-white fw-bold mb-4">Nuestros planes</h1>

    {/* Cards */}
    <div className="row g-4">

      {/* Planes de dietas */}
      <div className="col-12 col-md-4">
        <div className="bg-dark rounded-4 p-4 h-100 d-flex flex-column">
          <h2 className="text-white text-center mb-4">Dietas a medida</h2>
          <p className="text-white">
            Rellena nuestra encuesta y recibe en unos pocos minutos tu dieta 100% a medida para que consigas los resultados que esperas.
          </p>
          <ul className="list-unstyled text-white flex-grow-1 mt-3">
            <li className="mb-3"><span className="text-danger fw-bold me-2">✓</span>Dieta 100% a medida</li>
            <li className="mb-3"><span className="text-danger fw-bold me-2">✓</span>Platos variados y faciles de preparar</li>
            <li className="mb-3"><span className="text-danger fw-bold me-2">✓</span>Sólo ingredientes de calidad nutritiva</li>
            <li className="mb-3"><span className="text-danger fw-bold me-2">✓</span>Lista de la compra</li>
            <li className="mb-3"><span className="text-danger fw-bold me-2">✓</span>Resultados en menso de 4 semanas</li>
          </ul>
          <div className="text-center">
            <p className="text-white fw-bold fs-5">Precio: 6,90€</p>
            <button className="btn btn-danger rounded-pill px-5">Comprar</button>
          </div>
        </div>
      </div>

      {/* Planes de ejercicios */}
      <div className="col-12 col-md-4">
        <div className="bg-dark rounded-4 p-4 h-100 d-flex flex-column">
          <h2 className="text-white text-center mb-4">Rutina personalizada</h2>
          <p className="text-white">
            Dependiendo de tus objetivos y tu estado inicial preparaemos una rutina a  medida para que consigas los resultados deseados.
          </p>
          <ul className="list-unstyled text-white flex-grow-1 mt-3">
            <li className="mb-3"><span className="text-danger fw-bold me-2">✓</span>Rutina 100% a medida</li>
            <li className="mb-3"><span className="text-danger fw-bold me-2">✓</span>Ejercicios variados y faciles de preparar</li>
            <li className="mb-3"><span className="text-danger fw-bold me-2">✓</span>Movimintos y pesos con los que puedes trabajar</li>
            <li className="mb-3"><span className="text-danger fw-bold me-2">✓</span>Te sentirás mejor desde la primer semana</li>
            <li className="mb-3"><span className="text-danger fw-bold me-2">✓</span>Resultados notables en menos de 2 meses</li>
          </ul>
          <div className="text-center">
            <p className="text-white fw-bold fs-5">Precio: 6,90€</p>
            <button className="btn btn-danger rounded-pill px-5">Comprar</button>
          </div>
        </div>
      </div>

      {/* Combo de las 2 */}
      <div className="col-12 col-md-4">
        <div className="bg-dark rounded-4 p-4 h-100 d-flex flex-column">
          <h2 className="text-white text-center mb-4">Combo dieta + rutina</h2>
          <p className="text-white">
            ¡Combinación explosiva! Cambiar tus hábitos alimenticios combinados con una 
            rutina de ejercicio 100% enfocada en tus objetivos te llevará al siguente nivel en muy poco tiempo.
          </p>
          <ul className="list-unstyled text-white flex-grow-1 mt-3">
            <li className="mb-3"><span className="text-danger fw-bold me-2">✓</span>Rutina 100% personalizada</li>
            <li className="mb-3"><span className="text-danger fw-bold me-2">✓</span>Ejercicios variados</li>
            <li className="mb-3"><span className="text-danger fw-bold me-2">✓</span>Movimintos y pesos con los que puedes trabajar</li>
            <li className="mb-3"><span className="text-danger fw-bold me-2">✓</span>Dieta a medida</li>
            <li className="mb-3"><span className="text-danger fw-bold me-2">✓</span>Platos variados y fáciles de preparar</li>
            <li className="mb-3"><span className="text-danger fw-bold me-2">✓</span>Sólo ingredientes de calidad nutritiva</li>
            <li className="mb-3"><span className="text-danger fw-bold me-2">✓</span>Lista de la compra</li>
          </ul>
          <div className="text-center">
            <p className="text-white fw-bold fs-5">Precio: 9,90€</p>
            <button className="btn btn-danger rounded-pill px-5">Comprar</button>
          </div>
        </div>
      </div>

    </div>
  </div>
</div>

);