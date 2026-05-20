import { useEffect } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { useNavigate } from "react-router-dom";
import services from "../services/apiServices";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe("pk_test_51TOOvNGlrpZscypFXXr4oPPJxde2nN4vYAGJMt23hJJm2mssRDM8eThgLdA2YrdMQatc7LYMR1nUImKOc9MtRl1M003eg2fI64");

const url = import.meta.env.VITE_BACKEND_URL;

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
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    store.cart.some(item => item.id === product.id)
                                        ? dispatch({
                                            type: "deleteItem",
                                            payload: product.id,
                                        })
                                        : dispatch({
                                            type: "addItem",
                                            payload: product,
                                        });
                                }
                                }
                            >
                                Add
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div >
    );
}

export default Products