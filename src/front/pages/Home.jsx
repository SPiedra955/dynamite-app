import React, { useEffect } from "react";
import rigoImageUrl from "../assets/img/rigo-baby.jpg";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import Calendar from "../components/Calendar.jsx";

export const Home = () => {
  const { store, dispatch } = useGlobalReducer();

  const loadMessage = async () => {
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL;

      if (!backendUrl)
        throw new Error("VITE_BACKEND_URL is not defined in .env file");

      const response = await fetch(backendUrl + "/api/hello");
      const data = await response.json();

      if (response.ok) dispatch({ type: "set_hello", payload: data.message });

      return data;
    } catch (error) {
      if (error.message)
        throw new Error(
          `Could not fetch the message from the backend.
				Please check if the backend is running and the backend port is public.`,
        );
    }
  };

  useEffect(() => {
    loadMessage();
  }, []);

  return (
    <div className="bg-dark p-0 pt-1">
        <div className="bg-danger w-100 d-flex flex-column align-items-center justify-content-center py-5">
          <p className="text-center h1 text-white px-3 my-3">
            Ponerte en forma nunca fue tan sencillo
          </p>
          <p className="text-center h3 text-white px-3 my-3 mx">
            Nuestro sistema 100% personalizado te ayudará a mejorar tu estado de forma en muy pocas semanas
          </p>
          <button className="btn btn-dark rounded-pill px-5 m-3">
            Saber más
          </button>
        </div>

            
        {/* Primera card */}

      <div className="container py-5">
        <div className="row align-items-center g-4">
          
          {/* Texto a la izquierda */}
          <div className="col-12 col-md-6">
            <div className="bg-dark text-white p-4 p-md-5 h-100 rounded-3">
              <h3 className="card-title">Rutinas personalizadas</h3>
              <div className="border border-danger border-top my-3"></div>
              <p className="card-text">
                This is a wider card with supporting text below as a natural 
                lead-in to additional content. This is a wider card with supporting text below as a natural 
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
              src="https://sportrade.es/wp-content/uploads/2024/08/13_Bog_entrenamiento_funcional.jpg" 
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

          {/* Imagen a la izquierdaa */}
          <div className="col-12 col-md-6">
            <img 
              src="https://i.blogs.es/f2f4aa/istock_000058017076_small/1366_2000.jpg" 
              className="img-fluid rounded-3 w-100 object-fit-cover"
              style={{ maxHeight: "400px" }}
              alt="Entrenamiento funcional" 
            />
          </div>
          
          {/* Texto a la derecha */}
          <div className="col-12 col-md-6">
            <div className="bg-dark text-white p-4 p-md-5 h-100 rounded-3">
              <h3 className="card-title">Dietas específicas</h3>
              <div className="border border-danger border-top my-3"></div>
              <p className="card-text">
                This is a wider card with supporting text below as a natural 
                lead-in to additional content. This is a wider card with supporting text below as a natural 
                lead-in to additional content.
              </p>
              <button className="btn btn-danger rounded-pill px-5 mt-3">
                Empezar plan
              </button>
            </div>
          </div>    
        </div>        
      </div>


    </div>
  );
};
