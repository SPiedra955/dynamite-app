import { Link } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from 'react';
import services from "../services/apiServices";

export const CheckSub = () => {
    const { store, dispatch } = useGlobalReducer();
    useEffect(() => {
        services.isActive().then(data => {
            dispatch({
                type: "setSubscriptionPlan",
                payload: data.data?.active || false
            });
        });
    }, []);




    return (
        <div className="container d-flex justify-content-center align-items-center vh-100">
            <h3 className="text-center mb-3">

                {store.sub ? "Active subscription" : "No subscription"}

            </h3>
        </div>
    )
}
