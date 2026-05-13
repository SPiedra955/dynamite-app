import { useEffect } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";
import apiServices from "../services/apiServices";
import { useNavigate } from "react-router-dom";
import services from "../services/apiServices";

const Products = () => {
    const { store, dispatch } = useGlobalReducer();
    const navigate = useNavigate();

    useEffect(() => {
        services.getProducts().then(data => {
            console.log("DATA:", data)
            dispatch({
                type: 'getProducts',
                payload: data
            })
        })
    }, [])

    return (
        <div className="container d-flex justify-content-center align-items-center vh-100">
            <div className="card shadow p-4 text-center" style={{ width: "420px" }}>

                <h2 className="mb-3">Products</h2>

            </div>
        </div>
    );
}

export default Products