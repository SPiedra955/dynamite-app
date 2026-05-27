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
              <p className="card-text">
                This is a wider card with supporting text below as a natural
                lead-in to additional content.
              </p>
              <button className="btn btn-danger rounded-pill px-5 mt-3">
                Empezar plan
              </button>
            </div>
          </div>

          {/* Imagen a la derecha */}
          <div className="col-12 col-md-6">
            <img
              src="https://res.cloudinary.com/dr5mzsq8w/image/upload/v1779817716/13_Bog_entrenamiento_funcional_c4lora.jpg"
              className="img-fluid rounded-3 w-100 object-fit-cover"
              style={{ maxHeight: "400px" }}
              alt="Entrenamiento funcional"
            />
          </div>

        </div>
      </div>

      {/* Segunda card */}
      <div className="container py-5">
        <div className="row align-items-center g-4">

          {/* Imagen a la izquierda */}
          <div className="col-12 col-md-6">
            <img
              src="https://res.cloudinary.com/dr5mzsq8w/image/upload/v1779817763/1366_2000_bo9qaz.jpg"
              className="img-fluid rounded-3 w-100 object-fit-cover"
              style={{ maxHeight: "400px" }}
              alt="Entrenamiento funcional"
            />
          </div>

          {/* Texto a la derecha */}
          <div className="col-12 col-md-6">
            <div className="text-white p-4 p-md-5 h-100 rounded-3">
              <h3 className="card-title">Dietas específicas</h3>
              <div className="border border-danger border-top my-3"></div>
              <p className="card-text">
                This is a wider card with supporting text below as a natural
                lead-in to additional content.
              </p>
              <button className="btn btn-danger rounded-pill px-5 mt-3">
                Empezar plan
              </button>
            </div>
          </div>

        </div>
      </div>
    </>
  );
};