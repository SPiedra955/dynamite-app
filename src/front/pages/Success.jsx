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

        const timer = setTimeout(() => {
            if (planId) {
                navigate(`/encuesta?planId=${planId}`, {
                    state: { tipos: ["workout"] }
                });
            } else {
                navigate(`/encuesta`);
            }
        }, 3000);

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