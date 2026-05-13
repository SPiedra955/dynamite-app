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
                payload: data.data
            })
        })
    }, [])

    const prod = store.products || [];

    return (
        <div className="container py-4">
            <h2 className="mb-4 text-center">Products</h2>

            <div className="row">
                {prod?.map(product => (
                    <div className="col-md-4 mb-4" key={product?.id}>
                        <div className="card h-100 shadow-sm p-3 text-center">

                            <img
                                src={product?.image}
                                alt={product?.name}
                                className="img-fluid mb-2"
                            />

                            <h5>{product?.name}</h5>
                            <p>{product?.description}</p>
                            <p className="fw-bold">{product?.price} €</p>
                            <button
                                className="btn btn-success mt-auto"
                                onClick={() => console.log("Comprar:", product)}
                            >
                                BUY
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Products