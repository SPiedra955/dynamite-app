import { useEffect, useState } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";
import services from "../services/apiServices";

const Products = () => {
    const { store, dispatch } = useGlobalReducer();
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 8;

    useEffect(() => {
        services.getProducts().then(data => {
            dispatch({
                type: "getProducts",
                payload: data.data
            });
        });
    }, []);

    const prod = store.products || [];

    // Productos de la página actual
    const indexStart = (currentPage - 1) * productsPerPage;
    const currentProducts = prod.slice(indexStart, indexStart + productsPerPage);
    const totalPages = Math.ceil(prod.length / productsPerPage);

    return (
        <div className="container py-5 mt-4">
            <div className="text-center text-white mb-5">
                <h1 className="fw-bold display-5">Supplements</h1>
                <p className="text-white">
                    Premium supplements for performance and recovery
                </p>
            </div>

            <div className="row g-4">
                {currentProducts.map(product => {
                    const inCart = store.cart.some(
                        item => item.id === product.id
                    );

                    return (
                        <div
                            className="col-12 col-sm-6 col-lg-4 col-xl-3"
                            key={product.id}
                        >
                            <div className="product-card h-100">

                                <div className="product-image-wrapper">
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="product-image"
                                    />
                                </div>

                                <div className="p-3 d-flex flex-column h-100">

                                    <h5 className="fw-bold product-title">
                                        {product.name}
                                    </h5>

                                    <p className="text-muted small product-description">
                                        {product.description}
                                    </p>

                                    <div className="mt-auto">
                                        <div className="d-flex justify-content-between align-items-center mb-3">
                                            <span className="product-price">
                                                {product.price} €
                                            </span>
                                            <span className="badge bg-dark">
                                                Fitness
                                            </span>
                                        </div>

                                        <button
                                            className={`btn w-100 ${inCart ? "btn-outline-danger" : "btn-danger"}`}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                inCart
                                                    ? dispatch({ type: "deleteItem", payload: product.id })
                                                    : dispatch({ type: "addItem", payload: product });
                                            }}
                                        >
                                            {inCart ? "Remove from cart" : "Add to cart"}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Paginación */}
                {totalPages > 1 && (
                    <div className="d-flex justify-content-center align-items-center gap-3 mt-5">
                    <button
                        className="btn btn-danger"
                        onClick={() => setCurrentPage(p => p - 1)}
                        disabled={currentPage === 1}
                        >
                        ← Anterior
                    </button>

                    <button
                        className="btn btn-danger"
                        onClick={() => setCurrentPage(p => p + 1)}
                        disabled={currentPage === totalPages}
                        >
                        Siguiente →
                    </button>
                </div>
            )}
        </div>
    );
};

export default Products;
