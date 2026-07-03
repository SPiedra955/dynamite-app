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
        <div className="max-w-7xl mx-auto px-4 py-10 mt-16">

            {/* Header */}
            <div className="text-center text-white mb-12">
                <h1 className="text-4xl md:text-5xl font-bold">
                    Suplementos
                </h1>

                <p className="text-gray-300 mt-2">
                    Suplementos Premium para el rendimiento y la recuperación
                </p>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

                {currentProducts.map(product => {
                    const inCart = store.cart.some(item => item.id === product.id);

                    return (
                        <div
                            key={product.id}
                            className="rounded-xl shadow-lg overflow-hidden flex flex-col"
                        >

                            {/* Image */}
                            <div className="h-48 w-full overflow-hidden bg-transparent ">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-full h-full object-cover hover:scale-105 block"
                                />
                            </div>

                            {/* Content */}
                            <div className="bg-white p-4 flex flex-col flex-1">

                                <h5 className="font-bold text-lg mb-2">
                                    {product.name}
                                </h5>

                                <p className="text-gray-500 text-sm flex-1">
                                    {product.description}
                                </p>

                                {/* Price + badge */}
                                <div className="flex justify-between items-center mt-4">
                                    <span className="text-lg font-bold text-black">
                                        {product.price} €
                                    </span>

                                    <span className="bg-black text-white text-xs px-2 py-1 rounded">
                                        Fitness
                                    </span>
                                </div>

                                {/* Button */}
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        inCart
                                            ? dispatch({ type: "deleteItem", payload: product.id })
                                            : dispatch({ type: "addItem", payload: product });
                                    }}
                                    className={`mt-4 w-full py-2 rounded-lg font-semibold transition ${inCart
                                        ? "bg-white border border-red-500 text-red-500 hover:bg-red-50"
                                        : "bg-red-600 text-white hover:bg-red-700"
                                        }`}
                                >
                                    {inCart ? "Remove from cart" : "Add to cart"}
                                </button>

                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 mt-10">

                    <button
                        className="px-4 py-2 bg-red-600 text-white rounded-lg disabled:opacity-50"
                        onClick={() => setCurrentPage(p => p - 1)}
                        disabled={currentPage === 1}
                    >
                        ← Anterior
                    </button>

                    <span className="text-white">
                        Página {currentPage} / {totalPages}
                    </span>

                    <button
                        className="px-4 py-2 bg-red-600 text-white rounded-lg disabled:opacity-50"
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
