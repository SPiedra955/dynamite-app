import { useState } from "react";
import authService from "../services/apiServices";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { useNavigate } from "react-router-dom";

const PaymentError = () => {


    return (
        <div className="container d-flex justify-content-center align-items-center vh-100">
            <div className="card shadow p-4" style={{ width: "400px" }}>
                <h3 className="text-center mb-3">
                    Incomplete payment
                </h3>
            </div>
        </div>
    );
};

export default PaymentError;