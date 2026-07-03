import { useState } from "react";
import authService from "../services/apiServices";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

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
            if (error.response?.status === 401) {
                Swal.fire({
                    icon: "error",
                    title: "Credenciales incorrectas",
                    text: "El correo o la contraseña no son válidos",
                    confirmButtonColor: "#dc3545",
                });
            }
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const isLogin = formData.type === "login";

    return (
        <div className="h-screen flex items-center justify-center bg-black overflow-hidden">

            <div className="w-full max-w-md px-4">

                {/* HEADER */}
                <div className="flex items-center gap-4 p-4 bg-zinc-900 rounded-t-2xl border-b border-zinc-700">

                    <div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center flex-shrink-0">
                        <i className="bi bi-person-fill text-white text-lg"></i>
                    </div>

                    <div>
                        <p className="text-white font-bold text-lg">
                            {isLogin ? "Iniciar sesión" : "Crear cuenta"}
                        </p>

                        <p className="text-gray-400 text-sm">
                            {isLogin ? "Accede a tu cuenta" : "Rellena tus datos para registrarte"}
                        </p>
                    </div>

                </div>

                {/* FORM */}
                <form
                    onSubmit={handleSubmit}
                    className="p-5 bg-zinc-900 rounded-b-2xl"
                >

                    <p className="text-red-500 uppercase font-semibold text-sm mb-4">
                        {isLogin ? "Acceso" : "Registro"}
                    </p>

                    <div className="space-y-4">

                        {/* EMAIL */}
                        <div>
                            <label className="text-gray-400 uppercase text-xs font-semibold">
                                Email
                            </label>

                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="tu@email.com"
                                className="w-full mt-1 bg-black text-white border border-zinc-700 rounded-lg px-3 py-2 focus:outline-none focus:border-red-500"
                                required
                            />
                        </div>

                        {/* PASSWORD */}
                        <div>
                            <label className="text-gray-400 uppercase text-xs font-semibold">
                                Contraseña
                            </label>

                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="••••••••"
                                className="w-full mt-1 bg-black text-white border border-zinc-700 rounded-lg px-3 py-2 focus:outline-none focus:border-red-500"
                                required
                            />
                        </div>

                        {/* EXTRA FIELDS */}
                        {!isLogin && (
                            <>
                                <div className="border-t border-zinc-700 pt-4 mt-4">
                                    <p className="text-red-500 uppercase font-semibold text-sm mb-3">
                                        Datos personales
                                    </p>

                                    <div className="space-y-4">

                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            placeholder="Nombre"
                                            className="w-full bg-black text-white border border-zinc-700 rounded-lg px-3 py-2 focus:border-red-500 focus:outline-none"
                                        />

                                        <div className="grid grid-cols-3 gap-2">

                                            <input
                                                type="number"
                                                name="age"
                                                value={formData.age}
                                                placeholder="Edad"
                                                onChange={handleChange}
                                                className="bg-black text-white border border-zinc-700 rounded-lg px-2 py-2 focus:border-red-500"
                                            />

                                            <input
                                                type="number"
                                                name="weight"
                                                value={formData.weight}
                                                placeholder="Peso"
                                                onChange={handleChange}
                                                className="bg-black text-white border border-zinc-700 rounded-lg px-2 py-2 focus:border-red-500"
                                            />

                                            <input
                                                type="number"
                                                name="height"
                                                value={formData.height}
                                                placeholder="Altura"
                                                onChange={handleChange}
                                                className="bg-black text-white border border-zinc-700 rounded-lg px-2 py-2 focus:border-red-500"
                                            />

                                        </div>

                                        <input
                                            type="text"
                                            name="objective"
                                            value={formData.objective}
                                            onChange={handleChange}
                                            placeholder="Objetivo"
                                            className="w-full bg-black text-white border border-zinc-700 rounded-lg px-3 py-2 focus:border-red-500"
                                        />

                                    </div>
                                </div>
                            </>
                        )}

                        {/* BUTTON */}
                        <button
                            type="submit"
                            className="w-full bg-red-600 hover:bg-red-700 transition text-white font-semibold py-3 rounded-lg mt-4"
                        >
                            {isLogin ? "Iniciar sesión" : "Crear cuenta"}
                        </button>

                    </div>
                </form>

                {/* FOOTER */}
                <div className="text-center mt-4">
                    <span className="text-gray-400 text-sm">
                        {isLogin ? "¿No tienes cuenta? " : "¿Ya tienes cuenta?"}
                    </span>

                    <button
                        onClick={handleType}
                        className="text-red-500 ml-2 text-sm hover:underline"
                    >
                        {isLogin ? " Regístrate" : "Inicia sesión"}
                    </button>
                </div>

            </div>
        </div>
    );
};

export default Auth;