import { useState, useRef } from "react";

export function ProfileImageUploader() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [publicId, setPublicId] = useState("");
  const [error, setError] = useState("");
  const [preview, setPreview] = useState("");
  const fileInputRef = useRef(null);

  // Captura el archivo y genera una preview local antes de subir
  const handleFileChange = (e) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    setFile(selected);
    setError("");
    setPreview(URL.createObjectURL(selected));
  };

  // Sube la imagen al backend Flask → Cloudinary
  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("imagen", file);

    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL;
      const response = await fetch(`${backendUrl}/api/upload`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setImageUrl(data.url);
        setPublicId(data.public_id);
        setPreview("");
        setFile(null);
        // Limpia el input para poder volver a seleccionar el mismo archivo
        if (fileInputRef.current) fileInputRef.current.value = "";
      } else {
        setError("Error en el servidor al procesar la imagen.");
      }
    } catch (err) {
      console.error(err);
      setError("No se pudo conectar con el servidor backend.");
    } finally {
      setLoading(false);
    }
  };

  // Borra la imagen: limpia el estado local
  // Si tu backend tiene endpoint de borrado, llámalo aquí con publicId
  const handleDelete = async () => {
  if (!publicId) return;

  try {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const response = await fetch(`${backendUrl}/api/upload/${publicId}`, {
      method: "DELETE",
    });

    if (response.ok) {
      setImageUrl("");
      setPublicId("");
      setPreview("");
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } else {
      setError("No se pudo eliminar la imagen.");
    }
  } catch (err) {
    console.error(err);
    setError("No se pudo conectar con el servidor.");
  }
};

  // La imagen que se muestra en el avatar: primero preview local, luego la de Cloudinary
  const avatarSrc = preview || imageUrl;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&display=swap');

        .piu-wrapper {
          font-family: 'DM Sans', sans-serif;
          display: flex;
          justify-content: flex-end;
          padding: 24px;
        }

        .piu-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 14px;
          width: 160px;
        }

        /* ── Círculo del avatar ── */
        .piu-avatar-ring {
          position: relative;
          width: 96px;
          height: 96px;
          border-radius: 50%;
          background: linear-gradient(135deg, #e0e7ff 0%, #f0fdf4 100%);
          box-shadow: 0 0 0 3px #fff, 0 0 0 5px #c7d2fe;
          flex-shrink: 0;
        }

        .piu-avatar {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          object-fit: cover;
          display: block;
        }

        .piu-avatar-placeholder {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #e0e7ff;
        }

        .piu-avatar-placeholder svg {
          width: 40px;
          height: 40px;
          color: #818cf8;
        }

        /* Badge de cámara sobre el avatar */
        .piu-badge {
          position: absolute;
          bottom: 2px;
          right: 2px;
          width: 26px;
          height: 26px;
          border-radius: 50%;
          background: #4f46e5;
          border: 2px solid #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background 0.18s;
        }

        .piu-badge:hover {
          background: #4338ca;
        }

        .piu-badge svg {
          width: 13px;
          height: 13px;
          color: #fff;
        }

        /* Input file oculto */
        .piu-file-input {
          display: none;
        }

        /* Botones de acción */
        .piu-actions {
          display: flex;
          flex-direction: column;
          gap: 8px;
          width: 100%;
        }

        .piu-btn {
          width: 100%;
          padding: 8px 0;
          border-radius: 10px;
          border: none;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: opacity 0.18s, transform 0.12s;
        }

        .piu-btn:active {
          transform: scale(0.97);
        }

        .piu-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .piu-btn-primary {
          background: #4f46e5;
          color: #fff;
        }

        .piu-btn-primary:hover:not(:disabled) {
          background: #4338ca;
        }

        .piu-btn-danger {
          background: #fff;
          color: #ef4444;
          border: 1.5px solid #fca5a5;
        }

        .piu-btn-danger:hover:not(:disabled) {
          background: #fef2f2;
        }

        /* Estados de carga y error */
        .piu-loading {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          color: #6366f1;
        }

        .piu-spinner {
          width: 14px;
          height: 14px;
          border: 2px solid #c7d2fe;
          border-top-color: #4f46e5;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
          flex-shrink: 0;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .piu-error {
          font-size: 11.5px;
          color: #ef4444;
          text-align: center;
          line-height: 1.4;
        }

        .piu-label {
          font-size: 12px;
          color: #6b7280;
          text-align: center;
        }
      `}</style>

      <div className="piu-wrapper">
        <div className="piu-card">

          {/* Avatar circular */}
          <div className="piu-avatar-ring">
            {avatarSrc ? (
              <img className="piu-avatar" src={avatarSrc} alt="Foto de perfil" />
            ) : (
              <div className="piu-avatar-placeholder">
                {/* Icono de persona */}
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm0 2c-5.33 0-8 2.67-8 4v1h16v-1c0-1.33-2.67-4-8-4Z"/>
                </svg>
              </div>
            )}

            {/* Botón de cámara para seleccionar imagen */}
            <label className="piu-badge" title="Cambiar foto">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 15.5A3.5 3.5 0 0 1 8.5 12 3.5 3.5 0 0 1 12 8.5a3.5 3.5 0 0 1 3.5 3.5 3.5 3.5 0 0 1-3.5 3.5M20 4h-3.17L15 2H9L7.17 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2Z"/>
              </svg>
              <input
                ref={fileInputRef}
                className="piu-file-input"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                disabled={loading}
              />
            </label>
          </div>

          <span className="piu-label">Foto de perfil</span>

          {/* Acciones */}
          <div className="piu-actions">
            {loading ? (
              <div className="piu-loading">
                <div className="piu-spinner" />
                Subiendo...
              </div>
            ) : (
              <>
                {/* Botón guardar: aparece cuando hay archivo nuevo seleccionado */}
                {file && (
                  <button
                    className="piu-btn piu-btn-primary"
                    onClick={handleUpload}
                    disabled={loading}
                  >
                    Guardar foto
                  </button>
                )}

                {/* Botón eliminar: aparece cuando hay imagen guardada en Cloudinary */}
                {imageUrl && !file && (
                  <button
                    className="piu-btn piu-btn-danger"
                    onClick={handleDelete}
                  >
                    Eliminar foto
                  </button>
                )}
              </>
            )}
          </div>

          {error && <p className="piu-error">{error}</p>}
        </div>
      </div>
    </>
  );
}
