import { Link } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

// preguntas para desarollar el prompt de ejercicios
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

// devuelve las preguntas segun los tipos del plan elegido

const buildFields = (tipos) => {
  const fields = [];
  if (tipos.includes("workout")) fields.push(...workout_fields);
  if (tipos.includes("diet")) fields.push(...diet_fields);
  return fields;
};
const Encuesta = () => {
  const { store } = useGlobalReducer();
  const navigate = useNavigate();
  // location recoge el state de planes_de_suscripcionn
  // plan_id : id del plan elegido
  //tipos :["diet"],["workout"] o ["workout", "diet"] segun el plan

  const location = useLocation();

  const planId = location.state?.plan_id;

  const tipos = location.state?.tipos ?? [];

  //  campos del formulario segun el tipo de plan

  const fields = buildFields(tipos);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  // si no llego el plan_id redirige a planes de suscripcion

  useEffect(() => {
    if (!planId) navigate("/planes_de_suscripcion");
  }, []);

  // para campos de texto y select

  const handleField = (key, value) =>
    // ...prev copia todo lo anterior y asi si cambia algun valor se mantien y se añade el campo nuevo
    // [key]: value añade o sobreescribe solo el campo nuevo

    setFormData((prev) => ({ ...prev, [key]: value }));

  // para checkbox guarda un array con los valores seleccionados

  const handleCheckbox = (key, value) => {
    setFormData((prev) => {
      const current = prev[key] || [];
      if (current.includes(value)) {
        //si ya estaba marcado lo quitamos

        return {
          ...prev,
          [key]: current.filter((selected) => selected !== value),
        };
      }
      // si no estaba marcado lo añadimos

      return { ...prev, [key]: [...current, value] };
    });
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    try {
      // pillamos el token de store
      const token = localStorage.getItem("token");

      // pillamos datos del stpr
      const user = store.user;
      // lanza una petición por cada tipo de plan si es el completo envia las 2 a la vez
      const requests = tipos.map(async (tipo) => {
        const payload = {
          tipo_plan: tipo,
          plan_id: planId,
          age: user?.age,
          weight: user?.weight,
          height: user?.height,
          ...formData,
          // equipment llega como array, lo convertimos a string para el prompt,si es un array lo une con join (,) y lo pasa string
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
          },
        );
        const data = await resp.json();
        return data;
      });
      //  Sirve para esperar a que todas las peticiones del array requests terminen a la vez.
      const results = await Promise.all(request);
      // Sirve para comprobar si alguna de las peticiones a Gemini falló.
      const failed = results.find((result) => !result.success);

      if (failed) {
        setError(failed.msg || "Error al generar el plan");
        return;
      }
      // redirige al perfil para ver el plan generado
      navigate("/perfil", {
        state: { tab: "planes", newPlanId: results[0].data.id },
      });
    } catch {
      setError("No se pudo conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="bg-dark min-vh-100 py-5">
      <div className="container col-md-8 col-lg-6 mx auto">
        <h5 className="text-white mb-1"> Tu plan personalizado</h5>
        <div className="border border-danger border-top my-3"></div>
        <p className="text-white-50 small mb-4">
          {/* para que salga si es ejercicio o dieta o lo dos juntos con un + */}
          {tipos.map(tipo => tipo === "workout" ? "Ejercicio" : "Dieta").join(" + ")}
        </p>
{/* renderizza las preguntas segun el tipo de plan */}


      </div>
    </div>
  );
};

export default Encuesta;
