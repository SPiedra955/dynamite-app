import { useState, useEffect } from "react";
import authService from "../services/apiServices";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { useNavigate, useSearchParams } from "react-router-dom";

const Success = () => {
    const { dispatch } = useGlobalReducer();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const planId = searchParams.get("planId");

    useEffect(() => {
        localStorage.removeItem("cart");
        dispatch({ type: "clearCart" });

        const fetchPlanAndRedirect = async () =>{
            if (planId){
                try {
                    const resp = await fetch (`${import.meta.env.VITE_BACKEND_URL}/api/subscription-plans/${planId}`);
                    const data = await resp.json();
                    const nombre = data.data?.name?.toLowerCase() || "";

                    let tipos;
                    if (nombre.includes("dieta"))  tipos = ["diet"] ;
                    else if (nombre.includes("ejercicio"))  tipos = ["workout"] ;
                    else tipos = ["workout","diet"] ;

                    navigate (`/encuesta?planId=${planId}`, {state: {tipos} });
                    
                } catch  {
                    navigate (`/encuesta?planId=${planId}`, {state: {tipos: ["workout", "diet"]} });

                    
                }
                }else {
                    navigate("/");
                }
        };
        
           const timer = setTimeout(fetchPlanAndRedirect, 3000);
        return () => clearTimeout(timer);
    }, [dispatch, navigate, planId]);


       
    return (
        <div className="container d-flex justify-content-center align-items-center vh-100">
            <div className="card shadow p-4" style={{ width: "400px" }}>
                <h3 className="text-center mb-3">
                    Payment completed successfully
                </h3>
            </div>
        </div>
    );
};

export default Success;