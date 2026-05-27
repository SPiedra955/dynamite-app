import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

const API = import.meta.env.VITE_BACKEND_URL

const Perfil = () => {
    const { store, dispatch } = useGlobalReducer();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({

        name: store.user?.name || "",
        email: store.user?.email || "",
        age: store.user?.age || "",
        weight: store.user?.weight || "",
        height: store.user?.height || "",
        objective: store.user?.objective || "",
        password: "",
    });

    const [error, setSaveError] = useState(null);


    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaveError(null);

        try {
            const token = localStorage.getItem("token");
            const userId = store.user?.id;


            const payload = {

                name: formData.name,
                email: formData.email,
                age: formData.age,
                weight: formData.weight,
                height: formData.height,
                objective: formData.objective,
                ...(formData.password ? { password: formData.password } : {})
            };
            const resp = await fetch(`${API}/api/update/user/${userId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },

                body: JSON.stringify(payload)
            });
            const data = await resp.json();

            if (!resp.ok) {
                setSaveError(data.msg || "Error al guardar");
                return;
            }
            dispatch({ type: 'auth', payload: { user: data.data } });
            setFormData(prev => ({ ...prev, password: "" }));

        } catch (error) {
            setSaveError("No se pudo conectar con el servidor.")

        }
    };
    return (
        <div>
            <h5>Tus datos</h5>



            <form onSubmit={handleSubmit}>
                <div>
                    <label> Nombre </label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} />
                </div>

                <div>
                    <label> Email </label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} />
                </div>

                <div>
                    <label> Edad </label>
                    <input type="number" name="age" value={formData.age} onChange={handleChange} />
                </div>

                <div>
                    <label> Peso(kg) </label>
                    <input type="number" name="weight" value={formData.weight} onChange={handleChange} />
                </div>

                <div>
                    <label> Altura(cm) </label>
                    <input type="number" name="height" value={formData.height} onChange={handleChange} />
                </div>

                <div>
                    <label> Objetivo </label>
                    <input type="text" name="objective" value={formData.objective} onChange={handleChange} />
                </div>

                <div>
                    <label> Nueva contraseña (opcional) </label>
                    <input type="password" name="password" value={formData.password} onChange={handleChange} />
                </div>

                {error && <p>{error}</p>}
                <input type="submit" value="guardar cambios" />
            </form>
            <button  onClick = {()=> navigate ("/misplanes")}> Mis planes  </button>
        </div>



    )






};

export default Perfil