import { useNavigate } from "react-router-dom";
import { useEffect } from 'react';
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import services from "../services/apiServices";

export const CheckSub = () => {
    const { store, dispatch } = useGlobalReducer();
    const navigate = useNavigate();

    useEffect(() => {
        services.isActive().then(data => {
            const isActive = data.data?.active || false;
            dispatch({
                type: "setSubscriptionPlan",
                payload: isActive
            });

            // Redirige según el estado de la suscripción
            if (isActive) {
                navigate("/profile"); // ✅ tiene suscripción → va al Perfil
            }
            // Si no tiene, se queda en el home normalmente
        });
    }, []);

    return null; // No renderiza nada visible
};
