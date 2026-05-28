
import { Link } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Planes_de_suscripcion = () => {
  const { store, dispatch } = useGlobalReducer();
  const navigate = useNavigate();

  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const resp = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/subscription-plans`);
        const data = await resp.json();
        if (data.success) setPlans(data.data);
        else setError("No se pudieron cargar los planes");
      } catch {
        setError("Error al conectar con el server");
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, []);

  const getType = (plan) => {
    const nombre = plan.name.toLowerCase();
    if (nombre.includes("dieta")) return ["diet"];
    if (nombre.includes("ejercicio")) return ["workout"];
    return ["workout", "diet"];
  };

  const handlePlan = (plan) => {
    if (!store.auth) {
      navigate("/authentication");
      return;
    }
    navigate("/encuesta", { state: { plan_id: plan.id, tipos: getType(plan) } });
  };
  
  if (loading) {
    return (
      <div className="bg-dark min-vh-100 d-flex align-items-center justify-content-center">
        <div className="text-center">
          <div className="spinner-border text-danger" />
          <p className="text-white-50 mt-3">Cargando planes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-dark min-vh-100 d-flex align-items-center justify-content-center">
        <p className="text-danger">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-dark min-vh-100 py-5">
      <div className="container">
        <div className="text-center mb-5">
          <h2 className="text-white">Elige tu plan</h2>
          <div className="border border-danger border-top my-3 mx-auto w-25"></div>
          <p className="text-white-50">Genera tu plan de dieta y ejercicio personalizado con IA</p>
        </div>

        <div className="row g-4 justify-content-center">
          {plans.map((plan) => (
            <div className="col-12 col-md-4" key={plan.id}>
              <div className="h-100 rounded-3 border border-secondary p-4 d-flex flex-column">
                <h5 className="text-white mb-0">{plan.name}</h5>
                <div className="border border-danger border-top my-3"></div>
                <div className="mb-3">
                  <span className="text-white fw-bold fs-3">{plan.price}</span>
                  <span className="text-white-50 small"> / mes</span>
                </div>
                {plan.description && (
                  <p className="text-white-50 small mb-4">{plan.description}</p>
                )}
                <button
                  className="btn btn-danger rounded-pill px-5 mt-auto w-100"
                  onClick={() => handlePlan(plan)}
                >
                  Elegir plan
                </button>
              </div>
            </div>
          ))}
        </div>

        {!store.auth && (
          <p className="text-center text-white-50 small mt-4">
            * Necesitas iniciar sesión para elegir un plan
          </p>
        )}
      </div>
    </div>
  );
};

export default Planes_de_suscripcion;
