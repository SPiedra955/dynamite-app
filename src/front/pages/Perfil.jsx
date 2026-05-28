import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { ProfileImageUploader } from "../components/ProfileImageUploader";

const API = import.meta.env.VITE_BACKEND_URL;

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
        ...(formData.password ? { password: formData.password } : {}),
      };

      const resp = await fetch(`${API}/api/update/user/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await resp.json();

      if (!resp.ok) {
        setSaveError(data.msg || "Error al guardar");
        return;
      }

      dispatch({ type: "auth", payload: { user: data.data } });
      setFormData((prev) => ({ ...prev, password: "" }));
    } catch (error) {
      setSaveError("No se pudo conectar con el servidor.");
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center py-5 mt-5 bg-black">
      <div className="w-100 px-3" style={{ maxWidth: 520 }}>

        {/* Cabecera */}
        <div className="d-flex align-items-center gap-3 p-4 bg-danger rounded-top-4">
          <ProfileImageUploader />
          <div>
            <p className="mb-0 text-white fs-4 fw-bold">Tu perfil</p>
            <p className="mb-0 text-white small">Gestiona tus datos personales</p>
          </div>
        </div>

        {/* Formulario */}
        <form
          onSubmit={handleSubmit}
          className="p-4 bg-dark bg-opacity-75 rounded-bottom-4"
        >
          {/* Sección personal */}
          <p className="text-danger text-uppercase fw-semibold mb-3" style={{fontSize: "0.7rem", letterSpacing: "0.12em"}}>
            Información personal
          </p>

          <div className="row g-3 mb-3">
            <div className="col-12">
              <label className="form-label text-secondary text-uppercase small fw-semibold">Nombre</label>
              <input
                type="text" name="name" value={formData.name} onChange={handleChange}
                placeholder="Tu nombre completo"
                className="form-control bg-dark text-white border-secondary"
              />
            </div>

            <div className="col-12">
              <label className="form-label text-secondary text-uppercase small fw-semibold">Email</label>
              <input
                type="email" name="email" value={formData.email} onChange={handleChange}
                placeholder="tu@email.com"
                className="form-control bg-dark text-white border-secondary"
              />
            </div>

            <div className="col-6">
              <label className="form-label text-secondary text-uppercase small fw-semibold">Edad</label>
              <input
                type="number" name="age" value={formData.age} onChange={handleChange}
                placeholder="25"
                className="form-control bg-dark text-white border-secondary"
              />
            </div>

            <div className="col-6">
              <label className="form-label text-secondary text-uppercase small fw-semibold">Peso (kg)</label>
              <input
                type="number" name="weight" value={formData.weight} onChange={handleChange}
                placeholder="70"
                className="form-control bg-dark text-white border-secondary"
              />
            </div>

            <div className="col-6">
              <label className="form-label text-secondary text-uppercase small fw-semibold">Altura (cm)</label>
              <input
                type="number" name="height" value={formData.height} onChange={handleChange}
                placeholder="175"
                className="form-control bg-dark text-white border-secondary"
              />
            </div>

            <div className="col-6">
              <label className="form-label text-secondary text-uppercase small fw-semibold">Objetivo</label>
              <input
                type="text" name="objective" value={formData.objective} onChange={handleChange}
                placeholder="Perder peso"
                className="form-control bg-dark text-white border-secondary"
              />
            </div>
          </div>

          <hr className="border-secondary" />

          {/* Sección seguridad */}
          <p className="text-danger text-uppercase fw-semibold mb-3" style={{fontSize: "0.7rem", letterSpacing: "0.12em"}}>
            Seguridad
          </p>

          <div className="mb-4">
            <label className="form-label text-secondary text-uppercase small fw-semibold">
              Nueva contraseña (opcional)
            </label>
            <input
              type="password" name="password" value={formData.password} onChange={handleChange}
              placeholder="••••••••"
              className="form-control bg-dark text-white border-secondary"
            />
          </div>

          {error && <p className="text-danger small">{error}</p>}

          <div className="d-flex flex-column gap-2">
            <button type="submit" className="btn btn-danger w-100 py-3">
              Guardar cambios
            </button>
            <button
              type="button"
              className="btn btn-danger w-100 py-3 d-flex align-items-center justify-content-center gap-2"
              onClick={() => navigate("/misplanes")}
            >
              <i className="ti ti-chart-bar"></i>
              Mis planes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Perfil;
