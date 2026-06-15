export const Card = () => {
  return (
    <>
      <div className="container py-5">
        <div className="row align-items-center g-4">

          {/* Texto a la izquierda */}
          <div className="col-12 col-md-6">
            <div className="text-white p-4 p-md-5 h-100 rounded-3">
              <h3 className="card-title">Rutinas personalizadas</h3>
              <div className="border border-danger border-top my-3"></div>
              <p className="text-white fw-bold fs-5">Transforma tu cuerpo de verdad.</p>
              <p className="text-white">
              Olvídate de las rutinas genéricas que no te dan ningún resultado.
              Nuestra APP analiza tu nivel actual, tu equipamiento, tus objetivos y tu historial
              para diseñar un plan específico de 12 semanas completamente personalizado para ti.
              Sin importar tu nivel, nuestra IA entrenada se adapta a ti para que en menos de
              dos meses consigas resultados reales.
              </p>
              
              <a href="#plans" className="btn btn-danger rounded-pill px-5 mt-3">
                Empezar plan
              </a>
            </div>
          </div>

          {/* Imagen a la derecha */}
          <div className="cards-sales col-12 col-md-6">
            <img
              src="https://res.cloudinary.com/dr5mzsq8w/image/upload/v1779817716/13_Bog_entrenamiento_funcional_c4lora.jpg"
              className="img-fluid rounded-3 w-100 object-fit-cover"
              alt="Entrenamiento funcional"
            />
          </div>

        </div>
      </div>

      {/* Segunda card */}
      <div className="container py-5">
        <div className="row align-items-center g-4">

          {/* Imagen a la izquierda */}
          <div className="cards-sales col-12 col-md-6">
            <img
              src="https://res.cloudinary.com/dr5mzsq8w/image/upload/v1779817763/1366_2000_bo9qaz.jpg"
              className="img-fluid rounded-3 w-100 object-fit-cover" alt="Entrenamiento funcional"
            />
          </div>

          {/* Texto a la derecha */}
          <div className="col-12 col-md-6">
            <div className="text-white p-4 p-md-5 h-100 rounded-3">
              <h3 className="card-title">Dietas específicas</h3>
              <div className="border border-danger border-top my-3"></div>
              <p className="text-white fw-bold fs-5">Tu dieta 100% personalizada y adaptada a tus objetivos.</p><p className="text-white-50">Mediante un sencillo cuestionario recogemos toda la información necesaria y nuestra IA  entrenada prepara un plan real de 12 semanas con menú semanal, con recetas riquísimas  y fáciles de preparar, perfectas para tu rutina y tu bolsillo. </p>
              <a href="#plans" className="btn btn-danger rounded-pill px-5 mt-3">
                Empezar plan
              </a>
            </div>
          </div>

        </div>
      </div>
    </>
  );
};