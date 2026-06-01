import useGlobalReducer from "../hooks/useGlobalReducer";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const planBenefits = {
  "Plan Dieta": [
    "Dieta 100% personalizada según tu objetivo",
    "Menú semanal variado y fácil de preparar",
    "Solo ingredientes de calidad nutricional",
    "Macros y calorías calculados para ti",
    "Resultados visibles en menos de 4 semanas",
  ],
  "Plan Ejercicio": [
    "Rutina 100% adaptada a tu nivel",
    "Ejercicios variados con progresión",
    "Pesos y series ajustados a ti",
    "Te sentirás mejor desde la primera semana",
    "Calentamiento y vuelta a la calma incluidos",
    "Resultados notables en menos de 2 meses",
  ],
  "Plan Completo": [
    "Dieta y rutina 100% personalizadas",
    "Sinergia entre alimentación y entrenamiento",
    "Menú semanal con lista de la compra",
    "Ejercicios adaptados a tu equipamiento",
    "Máxima eficiencia para alcanzar tu objetivo",
    "El camino más rápido a tu mejor versión",
  ],
};

const Plans = () => {
  const { store, dispatch } = useGlobalReducer();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const url = import.meta.env.VITE_BACKEND_URL;
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const url = `${import.meta.env.VITE_BACKEND_URL}/api/subscription-plans`;

        // console.log("Fetching:", url);

        const resp = await fetch(url);

        // console.log("Status:", resp.status);

        if (!resp.ok) {
          throw new Error(`HTTP ${resp.status}`);
        }

        const data = await resp.json();

        // console.log("Data:", data);

        if (data.success) {
          setPlans(data.data);
        } else {
          setError("No se pudieron cargar los planes");
        }
      } catch (err) {
        console.error(err);
        setError("Error al conectar con el servidor");
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
    if (!token) {
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
        <div className="text-center my-5">
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
                  <div
                    className="text-white-50 small mb-3"
                    dangerouslySetInnerHTML={{
                      __html: plan.description,
                    }}
                  />
                )}

                {/* Lista de beneficios */}
                <ul className="list-unstyled flex-grow-1 mb-4">
                  {(planBenefits[plan.name] || []).map((benefit) => (
                    <li key={benefit} className="text-white-50 small mb-2">
                      <span className="text-danger fw-bold me-2">✓</span>
                      {benefit}
                    </li>
                  ))}
                </ul>

                <button
                  className="btn btn-danger rounded-pill px-5 mt-auto w-100"
                  onClick={async () => {
                    if (!token) {
                      navigate("/authentication");
                      return;
                    }

                    try {
                      const res = await fetch(`${url}/api/create-subscription-checkout`, {
                        method: "POST",
                        headers: {
                          Authorization: `Bearer ${token}`,
                          "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                          email: store.user.email,
                          id: plan.id,
                        }),
                      });

                      const data = await res.json();

                      if (data.url) {
                        window.location.href = data.url;
                      }
                    } catch (error) {
                      console.error(error);
                    }
                  }}
                >
                  Elegir plan
                </button>
              </div>
            </div>
          ))}
        </div>

        {!token && (
          <p className="text-center text-white-50 small mt-4">
            * Necesitas iniciar sesión para elegir un plan
          </p>
        )}
      </div>
    </div>
  );
};

export default Plans;