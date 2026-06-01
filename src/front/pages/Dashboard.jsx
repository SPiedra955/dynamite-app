import { useEffect } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";
import apiServices from "../services/apiServices";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const Dashboard = () => {
    const { store, dispatch } = useGlobalReducer();
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) return navigate("/");

        if (token && !store.user) {
            apiServices.getMe().then((data) =>
                dispatch({
                    type: "auth",
                    payload: {
                        user: data.data,
                    },
                })
            );
        }
    }, []);

    const handleLogout = () => {
        apiServices.logout();

        dispatch({
            type: "logout",
        });

        navigate("/");
    };

    return (
        <div
            className="d-flex justify-content-center align-items-center vh-100 text-white px-3"
            style={{
                background:
                    "linear-gradient(135deg, #0f0f0f, #1c1c1c, #2b2b2b)",
            }}
        >
            <div
                className="text-center p-5 shadow-lg"
                style={{
                    maxWidth: "450px",
                    borderRadius: "25px",
                    background: "rgba(255,255,255,0.08)",
                    backdropFilter: "blur(12px)",
                    border: "1px solid rgba(255,255,255,0.1)",
                }}
            >
                {/* Avatar */}
                <div className="mb-4">
                    <div
                        className="mx-auto d-flex justify-content-center align-items-center"
                        style={{
                            width: "110px",
                            height: "110px",
                            borderRadius: "50%",
                            background:"linear-gradient(135deg, #ff416c, #ff4b2b)",
                            fontSize: "42px",
                            fontWeight: "bold",
                        }}
                    >
                        <i className="bi bi-person-fill"></i>
                    </div>
                </div>

                {/* Welcome */}
                <h1 className="fw-bold mb-3">
                    Welcome Back 👋
                </h1>

                <p
                    className="mb-4"
                    style={{
                        color: "rgba(255,255,255,0.7)",
                        fontSize: "16px",
                    }}
                >
                    We are happy to see you again.
                    Your account is now active.
                </p>

                {/* Email */}
                <div
                    className="p-3 mb-4"
                    style={{
                        background: "rgba(255,255,255,0.05)",
                        borderRadius: "15px",
                    }}
                >
                    <p
                        className="mb-1"
                        style={{
                            color: "rgba(255,255,255,0.6)",
                            fontSize: "14px",
                        }}
                    >
                        Logged in as
                    </p>

                    <h5 className="fw-bold mb-0">
                        {store.user?.email}
                    </h5>
                </div>

                {/* Buttons */}
                <div className="d-grid gap-3">

                    <Link
                        className="btn btn-danger py-2 fw-bold"
                        style={{
                            borderRadius: "12px",
                        }} to="/products"
                    >
                        Go Shopping
                    </Link>

                    <button
                        className="btn btn-outline-light py-2"
                        style={{
                            borderRadius: "12px",
                        }}
                        onClick={handleLogout}
                    >
                        Logout
                    </button>

                </div>
            </div>
        </div>
    );
};

export default Dashboard;