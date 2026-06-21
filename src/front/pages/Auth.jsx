import { useState } from "react";
import authService from "../services/apiServices";
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
            if (data.data.role === "admin") {
                navigate("/admin");
            } else {
                navigate("/profile");
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const isLogin = formData.type === "login";

    return (
        <div className="min-vh-100 d-flex align-items-center justify-content-center bg-black py-5">
            <div className="w-100 px-3" style={{ maxWidth: 440 }}>

                {/* Cabecera */}
                <div className="d-flex align-items-center gap-3 p-4 bg-dark rounded-top-4 border-bottom border-secondary">
                    <div className="d-flex align-items-center justify-content-center rounded-circle bg-danger flex-shrink-0"
                        style={{ width: 48, height: 48 }}>
                        <i className="bi bi-person-fill text-white fs-5"></i>
                    </div>
                    <div>
                        <p className="mb-0 text-white fw-bold fs-5">
                            {isLogin ? "Iniciar sesión" : "Crear cuenta"}
                        </p>
                        <p className="mb-0 text-secondary small">
                            {isLogin ? "Accede a tu cuenta" : "Rellena tus datos para registrarte"}
                        </p>
                    </div>
                </div>

                {/* Formulario */}
                <form
                    onSubmit={handleSubmit}
                    className="p-4 bg-dark rounded-bottom-4"
                >
                    <p className="text-danger text-uppercase fw-semibold small mb-3">
                        {isLogin ? "Acceso" : "Registro"}
                    </p>

                    <div className="row g-3">

                        {/* EMAIL */}
                        <div className="col-12">
                            <label className="form-label text-secondary text-uppercase small fw-semibold">Email</label>
                            <input
                                type="email"
                                className="form-control bg-black text-white border-secondary"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="tu@email.com"
                                required
                                minLength={5}
                                maxLength={100}
                                pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$"
                                title="Introduce un email válido"
                            />
                        </div>

                        {/* PASSWORD */}
                        <div className="col-12">
                            <label className="form-label text-secondary text-uppercase small fw-semibold">Contraseña</label>
                            <input
                                type="password"
                                className="form-control bg-black text-white border-secondary"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="••••••••"
                                required
                                minLength={4}
                                maxLength={20}
                                pattern="^[A-Za-z0-9]{4,20}$"
                                title="Solo letras y números, entre 4 y 20 caracteres"
                            />
                        </div>

                        {/* CAMPOS SOLO REGISTRO */}
                        {!isLogin && (
                            <>
                                <div className="col-12">
                                    <hr className="border-secondary" />
                                    <p className="text-danger text-uppercase fw-semibold small mb-3">Datos personales</p>
                                </div>

                                <div className="col-12">
                                    <label className="form-label text-secondary text-uppercase small fw-semibold">Nombre</label>
                                    <input
                                        type="text"
                                        className="form-control bg-black text-white border-secondary"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="Tu nombre"
                                        required
                                        minLength={2}
                                        maxLength={50}
                                        pattern="^[A-Za-zÀ-ÿ\s]+$"
                                        title="Solo letras"
                                    />
                                </div>

                                <div className="col-4">
                                    <label className="form-label text-secondary text-uppercase small fw-semibold">Edad</label>
                                    <input
                                        type="number"
                                        className="form-control bg-black text-white border-secondary"
                                        name="age"
                                        value={formData.age}
                                        onChange={handleChange}
                                        placeholder="25"
                                        required
                                        min={10}
                                        max={100}
                                    />
                                </div>

                                <div className="col-4">
                                    <label className="form-label text-secondary text-uppercase small fw-semibold">Peso (kg)</label>
                                    <input
                                        type="number"
                                        className="form-control bg-black text-white border-secondary"
                                        name="weight"
                                        value={formData.weight}
                                        onChange={handleChange}
                                        placeholder="70"
                                        required
                                        min={20}
                                        max={300}
                                        step="0.1"
                                    />
                                </div>

                                <div className="col-4">
                                    <label className="form-label text-secondary text-uppercase small fw-semibold">Altura (cm)</label>
                                    <input
                                        type="number"
                                        className="form-control bg-black text-white border-secondary"
                                        name="height"
                                        value={formData.height}
                                        onChange={handleChange}
                                        placeholder="175"
                                        required
                                        min={50}
                                        max={250}
                                    />
                                </div>

                                <div className="col-12">
                                    <label className="form-label text-secondary text-uppercase small fw-semibold">Objetivo</label>
                                    <input
                                        type="text"
                                        className="form-control bg-black text-white border-secondary"
                                        name="objective"
                                        value={formData.objective}
                                        onChange={handleChange}
                                        placeholder="Perder peso, ganar músculo..."
                                        required
                                        minLength={3}
                                        maxLength={100}
                                    />
                                </div>
                            </>
                        )}

                        {/* BOTÓN SUBMIT */}
                        <div className="col-12 mt-2">
                            <button type="submit" className="btn btn-danger w-100 py-3 fw-semibold">
                                {isLogin ? "Iniciar sesión" : "Crear cuenta"}
                            </button>
                        </div>

                    </div>
                </form>

                {/* Cambiar entre login y register */}
                <div className="text-center mt-3">
                    <span className="text-secondary small">
                        {isLogin ? "¿No tienes cuenta?" : "¿Ya tienes cuenta?"}
                    </span>
                    <button
                        type="button"
                        className="btn btn-link text-danger p-0 ms-2 small text-decoration-none"
                        onClick={handleType}
                    >
                        {isLogin ? "Regístrate" : "Inicia sesión"}
                    </button>
                </div>

            </div>
        </div>
    );
};

export default Auth;