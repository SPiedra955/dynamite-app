import { Link } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";

const workout_fields = [
  {
    key: "days_per_week",
    label: "Dias por semana",
    type: "select",
    required: true,
    options: ["1", "2", "3", "4", "5", "6"],
  },
  {
    key: "session_duration",
    label: "Duracion por sesion(min)",
    type: "select",
    required: true,
    options: ["30", "45", "60", "75", "90"],
  },
  {
    key: "equipment",
    label: "Equipamiento",
    type: "checkbox",
    required: true,
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
    required: true,
    options: ["Principiante", "Intermedio", "Avanzado"],
  },
  {
    key: "time_without_training",
    label: "Tiempo sin entrenar",
    type: "select",
    required: true,
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
    required: false,
    placeholder: "Ej:rodilla derecha",
  },
  {
    key: "workout_goal",
    label: "Objetivo en 12 semanas",
    type: "select",
    required: true,
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
    required: true,
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
    required: true,
    options: ["2", "3", "4", "5"],
  },
  {
    key: "budget",
    label: "Presupuesto",
    type: "select",
    required: true,
    options: ["Ajustando", "Estandar", "Sin limite"],
  },
  {
    key: "diet_type",
    label: "Tipo de dieta",
    type: "select",
    required: true,
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
    required: false,
    type: "text",
    placeholder: "Ej:lactosa, gluten... o ninguna",
  },
  {
    key: "disliked_foods",
    label: "Alimentos que no te gustan",
    type: "text",
    required: false,
    placeholder: "Ej:brocoli, higado..... o ninguno",
  },
  {
    key: "diet_goal",
    label: "Objetivo en 12 semanas",
    type: "select",
    required: true,
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
  const [searchParams] = useSearchParams();
  const planId = Number(searchParams.get("planId"));
  const tipos = location.state?.tipos ?? [];
  const fields = buildFields(tipos);

  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const id = searchParams.get("planId");

    if (!id || isNaN(Number(id))) {
      navigate("/subscription-plans");
    }
  }, [searchParams]);
  useEffect(() => {
    if (!tipos.length) {
      console.warn("No hay tipos de plan");
    }
  }, [tipos]);


  useEffect(() => {
    if (!error) return;
    const timer = setTimeout(() => setError(null), 3000)
    return () => clearTimeout(timer);
  }, [error]);

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

    const requiredWorkout = ["days_per_week", "session_duration", "equipment", "fitness_level", "time_without_training", "workout_goal"];

    const requiredDiet = ["activity_level", "meals_per_day", "budget", "diet_type", "diet_goal"];

    const obligatorios = [];

    if (tipos.includes("workout")) obligatorios.push(...requiredWorkout);
    if (tipos.includes("diet")) obligatorios.push(...requiredDiet);

    const vacios = obligatorios.filter(key => {
      const val = formData[key];
      if (Array.isArray(val)) return val.length === 0;
      return !val || val.trim() === "";
    });

    if (vacios.length > 0) {
      setError(" Porfavor rellana todos los campos obligatorios.")
      return;
    }


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


  return (
    <div className="bg-black min-vh-100 py-5 mt-5">
      <div className="container col-md-8 col-lg-6 mx-auto">

        {/* Pantalla de carga */}
        {/* Pantalla de carga */}
        {loading && (
          <div
            className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-black"
            style={{ zIndex: 9999 }}
          >
            <div className="text-center px-3">

              <div
                className="spinner-border text-danger mb-4"
                style={{
                  width: "clamp(3rem, 10vw, 5rem)",
                  height: "clamp(3rem, 10vw, 5rem)"
                }}
                role="status"
              >
                <span className="visually-hidden">Loading...</span>
              </div>

              <h5 className="text-danger fw-semibold mb-2">
                Generando tu plan personalizado
              </h5>

              <p className="text-secondary small mb-0">
                Esto puede tardar unos segundos mientras la IA trabaja
              </p>

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
                  {field.required && <span className="text-danger ms-1">*</span>}
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
                onClick={() => navigate("/my-plans")}
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
