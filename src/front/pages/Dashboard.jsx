import { useEffect } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";
import apiServices from "../services/apiServices";
import { useNavigate } from "react-router-dom";

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
        <div className="container d-flex justify-content-center align-items-center vh-100">
            <div className="card shadow p-4 text-center" style={{ width: "420px" }}>

                <h2 className="mb-3">Private Area</h2>

                <p className="text-muted mb-4">
                    You are logged in as:
                </p>

                <h5 className="mb-4 fw-bold">
                    {store.user?.email}
                </h5>

                <button
                    className="btn btn-danger w-100"
                    onClick={handleLogout}
                >
                    Logout
                </button>

            </div>
        </div>
    );
};

export default Dashboard;