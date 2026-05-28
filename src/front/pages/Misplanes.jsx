import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";


const API = import.meta.env.VITE_BACKEND_URL


const Misplanes = () => {


    const { store } = useGlobalReducer();
    const navigate = useNavigate();

    const [plans, setPlans] = useState([]);
    const [planActive, setPlanActive] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {

        const fetchPlanes = async () => {
            // mientras carga los planes esta en este estado
            setLoading(true);
            try {
                const token = localStorage.getItem("token");
                const resp = await fetch(`${API}/api/myplans`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const data = await resp.json();
                if (data.success) setPlans(data.data);
            } catch {
                setError("No se pudieron cargar los planes");
            } finally {
                setLoading(false);
            }

        };

        fetchPlanes();
    }, []);


    const handleEliminar = async (planId) => {

        try {

            const token = localStorage.getItem("token");
            const resp = await fetch(`${API}/api/myplans/${planId}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await resp.json();
            if (data.success) {
                setPlans(prev => prev.filter(plan => plan.id !== planId));

                if (planActive?.id === planId) setPlanActive(null);
            }

        } catch {
            setError("No se pudo eliminar el plan ");

        }



    };
    // render del plann 

    const renderPlan = (plan) => {
        const data = plan.plan_data;

        if (plan.tipo_plan === "workout") {
            return (
                <div>
                    <h5>{data.plan_name}</h5>
                    <p> Objetivo :{data.goal}</p>
                    <p>{data.duration_weeks}semanas {data.weekly_structure?.days_per_week} dias/semana</p>

                    {data.weeks?.map((weekBlock) => (
                        <div key={weekBlock.week_range}>
                            <p>{weekBlock.week_range}</p>
                            <p>{weekBlock.phase}</p>
                            <p>{weekBlock.focus}</p>
                            {weekBlock.sessions?.map((session) => (

                                <div key={session.day}>
                                    <p>{session.day} - {session.type} </p>
                                    <p>{session.warmup}</p>

                                    {session.exercises?.map((ejercicio) => (

                                        <div key={ejercicio.name}>
                                            <p> {ejercicio.name} - {ejercicio.sets} series x {ejercicio.reps} . {ejercicio.rest_seconds} s descanso </p>

                                            <p>{ejercicio.notes}</p>
                                        </div>)
                                    )}
                                    <p>{session.cooldown}</p>
                                </div>

                            ))}



                        </div>
                    ))}

                    {data.general_tips?.map((tip) => (
                        <p key={tip}> •  {tip}</p>
                    ))}
                    <p> {data.progression_notes}</p>
                </div>
            )
        }

        
        // dieta
        return(
            <div>
          
          <h5>{data.plan_name}</h5>
          <p>Objetivo:{data.goal}</p>
          <p>{data.daily_calories} kcal/dia  Proteinas : {data.macros?.protein_g}g  Carbohidratos : {data.macros?.carbs_g}g</p>
           
           {data.weekly_menu?.map((weekBlock)=>(
               <div key={weekBlock.week_range}>
                <p> {weekBlock.week_range} - {weekBlock.phase}</p>

                {weekBlock.days?.map((day)=>(
                    <div key={day.day}>
                        <p>{day.day}</p>

                        {day.meals?.map((meal)=>(
                            <div key={meal.meal_type}>
                                <p>{meal.meal_type} {meal.time && `. ${meal.time}`} - {meal.total_calories} kcal </p>
                            
                            {meal.foods?.map((food)=>(
                                <p key={food.name}> {food.name} . {food.quantity} . {food.calories} kcal</p>
                                
                            )
                        )}
                            </div>
                        ))}
                    </div>
                ))}
            </div>
           ))}
           {data.general_tips?.map((tip)=>(
               <p key={tip}> • {tip}</p>
            ))}
        </div>
    )
    
    
};


return (
    <div>
{/* detalle del plan */}
     {planActive ? (
        <div>
         <button onClick={() => setPlanActive(null)}> Volver</button>
         {renderPlan(planActive)}

        </div>


     ) : (
        <div>

            <h5> Mis planes</h5>
            <button onClick={()=> navigate("/planes_de_suscripcion")}> Nuevo plan </button>
             
             {loading && <p> Cargando planes...</p>}
             {error && <p>{error}</p>}

             {!loading && plans.length === 0 && (<p> Aun no tienes planes generados</p>)}

             {plans.map((plan)=>(
                <div key={plan.id}>
                    <p> {plan.plan_data?.plan_name || "Plan generado"}</p>
                    <p>{plan.tipo_plan === "workout" ? "Ejercicio" : "Dieta"} . {plan.plan_data?.duration_weeks} semanas</p>

                    <button onClick={ ()=> setPlanActive(plan)}>Ver plan</button>
                    <button onClick={ ()=> handleEliminar(plan.id)}>Eliminar</button>
                     </div>
             ))}

             <button onClick={() => navigate ("/perfil")}> Volver al perfil 

             </button>
    
    </div>
     )}
    </div>
  );
};



export default Misplanes;
