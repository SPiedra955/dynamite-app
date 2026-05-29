import { Link } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const workout_fields = [
  {
    key: "days_per_week",
    label: "Dias por semana",
    type: "select",
    options: ["1", "2", "3", "4", "5", "6"],
  },
  {
    key: "session_duration",
    label: "Duracion por sesion(min)",
    type: "select",
    options: ["30", "45", "60", "75", "90"],
  },
  {
    key: "equipment",
    label: "Equipamiento",
    type: "checkbox",
    options: [
      "Sin equipamiento",
      "Bandas elasticas",
      "Mancuernas en casa",
      "Gimnasio completo",
    ],
  },
  {
    key: "fitness_level",
    label: "Nivel actual",
    type: "select",
    options: ["Principiante", "Intermedio", "Avanzado"],
  },
  {
    key: "time_without_training",
    label: "Tiempo sin entrenar",
    type: "select",
    options: [
      "Nunca he entrenado",
      "Menos de un 1 mes",
      "1-3 meses",
      "3-6 meses",
      "Entreno habitualmente",
    ],
  },
  {
    key: "injures",
    label: "Lesiones o limitaciones",
    type: "text",
    placeholder: "EJ:rodilla derecha",
  },
  {
    key: "workout_goal",
    label: "Objetivo en 12 semanas",
    type: "select",
    options: [
      "Bajar de peso",
      "Aumentar masa muscular",
      "Mejora de cardio",
      "Tonificar",
      "Ganar fuerza",
    ],
  },
];

const diet_fields = [
  {
    key: "activity_level",
    label: "Nivel de actividad fisica",
    type: "select",
    options: [
      "Sedentario",
      "Ligero (1-3 dias/semana)",
      "Moderado (3-5 dias/semana)",
      "Activo (6-7 dias/semana)",
      "Muy activo",
    ],
  },
  {
    key: "meals_per_day",
    label: "Numero de comidas",
    type: "select",
    options: ["2", "3", "4", "5"],
  },
  {
    key: "budget",
    label: "Presupuesto",
    type: "select",
    options: ["Ajustando", "Estandar", "Sin limite"],
  },
  {
    key: "diet_type",
    label: "Tipo de dieta",
    type: "select",
    options: [
      "Omnivora",
      "Vegetariana",
      "Vegana",
      "Sin gluten",
      "Sin lactosa",
      "Mediterranea",
    ],
  },
  {
    key: "allergies",
    label: "Alergias o intolerencias",
    type: "text",
    placeholder: "Ej:lactosa, gluten... o ninguna",
  },
  {
    key: "disliked_foods",
    label: "Alimentos que no te gustan",
    type: "text",
    placeholder: "Ej:brocoli, higado..... o ninguno",
  },
  {
    key: "diet_goal",
    label: "Objetivo en 12 semanas",
    type: "select",
    options: [
      "Perder  peso",
      "Ganar masa muscular",
      "Mantener el peso",
      "Mejorar energia y rendimiento",
      "Comer mas saludable",
    ],
  },
];

const buildFields = (tipos) => {
  const fields = [];
  if (tipos.includes("workout")) fields.push(...workout_fields);
  if (tipos.includes("diet")) fields.push(...diet_fields);
  return fields;
};

const Encuesta = () => {
  const { store } = useGlobalReducer();
  const navigate = useNavigate();
  const location = useLocation();

  const planId = location.state?.plan_id;
  const tipos = location.state?.tipos ?? [];
  const fields = buildFields(tipos);

  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [countdown, setCountdown] = useState(60);
  const [showModal, setShowModal] = useState(false);
  const countdownRef = useRef(null);

  useEffect(() => {
    if (!planId) navigate("/planes_de_suscripcion");
  }, []);

  // Inicia o detiene el countdown según el estado de loading
  useEffect(() => {
    if (loading) {
      setCountdown(120);
      countdownRef.current = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(countdownRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(countdownRef.current);
    }
    return () => clearInterval(countdownRef.current);
  }, [loading]);

  const handleField = (key, value) =>
    setFormData((prev) => ({ ...prev, [key]: value }));

  const handleCheckbox = (key, value) => {
    setFormData((prev) => {
      const current = prev[key] || [];
      if (current.includes(value)) {
        return { ...prev, [key]: current.filter((selected) => selected !== value) };
      }
      return { ...prev, [key]: [...current, value] };
    });
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      const user = store.user;

      const requests = tipos.map(async (tipo) => {
        const payload = {
          tipo_plan: tipo,
          plan_id: planId,
          age: user?.age,
          weight: user?.weight,
          height: user?.height,
          ...formData,
          equipment: Array.isArray(formData.equipment)
            ? formData.equipment.join(", ")
            : formData.equipment,
          goal: tipo === "workout" ? formData.workout_goal : formData.diet_goal,
        };

        const resp = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/myplans/generate`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
          }
        );
        const data = await resp.json();
        return data;
      });

      const results = await Promise.all(requests);
      const failed = results.find((result) => !result.success);

      if (failed) {
        setError(failed.msg || "Error al generar el plan");
        setLoading(false);
        return;
      }

      // Muestra el modal cuando termina
      setLoading(false);
      setShowModal(true);

    } catch {
      setLoading(false);
      setShowModal(true);
    }
  };

  // Porcentaje para el arco circular del countdown
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const progress = (countdown / 120) * circumference;

  return (
    <div className="bg-black min-vh-100 py-5 mt-5">
      <div className="container col-md-8 col-lg-6 mx-auto">

        {/* Pantalla de carga con countdown */}
        {loading && (
          <div className="d-flex flex-column align-items-center justify-content-center py-5 gap-4">
            <p className="text-danger text-uppercase fw-semibold small mb-0">Generando tu plan ¡en unos segundos te explotará la cabeza!</p>
            <p className="text-secondary small text-center mb-0">Esto puede tardar hasta un par de minutos...</p>

            {/* Círculo de cuenta regresiva */}
            <div className="position-relative d-flex align-items-center justify-content-center">
              <svg width="140" height="140" viewBox="0 0 140 140">
                {/* Círculo de fondo */}
                <circle
                  cx="70" cy="70" r={radius}
                  fill="none"
                  stroke="#2a2a2a"
                  strokeWidth="8"
                />
                {/* Arco de progreso */}
                <circle
                  cx="70" cy="70" r={radius}
                  fill="none"
                  stroke="#e63946"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={circumference - progress}
                  transform="rotate(-90 70 70)"
                  style={{ transition: "stroke-dashoffset 1s linear" }}
                />
              </svg>
              {/* Número en el centro */}
              <div className="position-absolute text-center">
                <span className="text-white fw-bold" style={{ fontSize: "2.2rem" }}>{countdown}</span>
                <p className="text-secondary mb-0" style={{ fontSize: "0.7rem" }}>segundos</p>
              </div>
            </div>
          </div>
        )}

        {/* Formulario — se oculta mientras carga */}
        {!loading && !showModal && (
          <>
            <h5 className="text-white mb-1">Tu plan personalizado</h5>
            <div className="border border-danger border-top my-3"></div>
            <p className="text-white-50 small mb-4">
              {tipos
                .map((tipo) => (tipo === "workout" ? "Ejercicio" : "Dieta"))
                .join(" + ")}
            </p>

            {fields.map((field) => (
              <div className="mb-4" key={field.key}>
                <label className="form-label text-white-50 small fw-semibold">
                  {field.label}
                </label>

                {field.type === "select" && (
                  <select
                    className="form-select bg-dark text-white border-secondary"
                    value={formData[field.key] || ""}
                    onChange={(e) => handleField(field.key, e.target.value)}
                  >
                    <option value="">Selecciona una opcion...</option>
                    {field.options.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                )}

                {field.type === "checkbox" && (
                  <div className="d-flex flex-column gap-2 mt-1">
                    {field.options.map((opt) => (
                      <div className="form-check" key={opt}>
                        <input
                          type="checkbox"
                          className="form-check-input"
                          id={`${field.key}-${opt}`}
                          checked={(formData[field.key] || []).includes(opt)}
                          onChange={() => handleCheckbox(field.key, opt)}
                        />
                        <label
                          className="form-check-label text-white-50"
                          htmlFor={`${field.key}-${opt}`}
                        >
                          {opt}
                        </label>
                      </div>
                    ))}
                  </div>
                )}

                {field.type === "text" && (
                  <input
                    className="form-control bg-dark text-white border-secondary"
                    type="text"
                    placeholder={field.placeholder}
                    value={formData[field.key] || ""}
                    onChange={(e) => handleField(field.key, e.target.value)}
                  />
                )}
              </div>
            ))}

            {error && (
              <div className="alert alert-danger py-2 small mb-3">{error}</div>
            )}

            <button
              className="btn btn-danger rounded-pill px-5 w-100"
              onClick={handleSubmit}
              disabled={loading}
            >
              {`Generar ${tipos.length > 1 ? "planes" : "plan"}`}
            </button>
          </>
        )}

        {/* Modal de éxito */}
        {showModal && (
          <div
            className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
            style={{ background: "rgba(0,0,0,0.85)", zIndex: 9999 }}
          >
            <div className="bg-dark border border-secondary rounded-4 p-5 text-center mx-3" style={{ maxWidth: 420 }}>
              <div className="mb-4">
                <div className="d-inline-flex align-items-center justify-content-center rounded-circle bg-danger mb-3"
                  style={{ width: 72, height: 72 }}>
                  <i className="bi bi-check-lg text-white" style={{ fontSize: 36 }}></i>
                </div>
                <h4 className="text-white fw-bold mb-2">¡Ya tienes tus planes!</h4>
                <p className="text-secondary mb-0">
                  Tu {tipos.length > 1 ? "plan personalizado está listo" : "planes personalizados están listos"} para empezar.
                </p>
              </div>
              <button
                className="btn btn-danger rounded-pill px-5 py-3 w-100 fw-semibold"
                onClick={() => navigate("/misplanes")}
              >
                Ver {tipos.length > 1 ? "planes" : "plan"}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Encuesta;
