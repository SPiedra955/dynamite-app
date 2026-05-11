import { useState } from "react";
import authService from "../services/authServices";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { useNavigate } from "react-router-dom";

const Auth = () => {
    const { dispatch } = useGlobalReducer();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
        name: "",
        age: "",
        weight: "",
        height: "",
        objective: "",
        type: "login",
    });

    const handleType = () => {
        setFormData((prev) => ({
            ...prev,
            type: prev.type === "register" ? "login" : "register",
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const data = await authService.auth(formData);

            dispatch({
                type: "auth",
                payload: {
                    user: data.data,
                    age: Number(formData.age),
                    weight: Number(formData.weight),
                    height: Number(formData.height),
                },
            });

            navigate("/dashboard");
        } catch (error) {
            console.error(error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    return (
        <div className="container d-flex justify-content-center align-items-center vh-100">
            <div className="card shadow p-4" style={{ width: "400px" }}>
                <h3 className="text-center mb-3">
                    {formData.type === "login" ? "Login" : "Register"}
                </h3>

                <form onSubmit={handleSubmit}>
                    {/* EMAIL */}
                    <div className="mb-3 text-start">
                        <label className="form-label">Email</label>
                        <input
                            type="email"
                            className="form-control"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* PASSWORD */}
                    <div className="mb-3 text-start">
                        <label className="form-label">Password</label>
                        <input
                            type="password"
                            className="form-control"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* 👇 SOLO REGISTER FIELDS */}
                    {formData.type === "register" && (
                        <>
                            <div className="mb-3 text-start">
                                <label className="form-label">Name</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="mb-3 text-start">
                                <label className="form-label">Age</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    name="age"
                                    value={formData.age}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="mb-3 text-start">
                                <label className="form-label">Weight (kg)</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    name="weight"
                                    value={formData.weight}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="mb-3 text-start">
                                <label className="form-label">Height (cm)</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    name="height"
                                    value={formData.height}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="mb-3 text-start">
                                <label className="form-label">Objective</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="objective"
                                    value={formData.objective}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </>
                    )}

                    <button type="submit" className="btn btn-primary w-100 mb-2">
                        {formData.type === "login" ? "Login" : "Register"}
                    </button>
                </form>

                <div className="text-center">
                    <small>
                        {formData.type === "login"
                            ? "Don't have an account?"
                            : "Already have an account?"}
                    </small>
                    <br />
                    <button
                        type="button"
                        className="btn btn-link p-0"
                        onClick={handleType}
                    >
                        Switch to {formData.type === "login" ? "Register" : "Login"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Auth;