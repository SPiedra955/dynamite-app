import { useState } from "react";

export function ImageUploader() {
  // Estados para controlar el archivo, la carga y la respuesta del servidor
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [error, setError] = useState("");

  // 1. Capturar el archivo individual cuando el usuario lo selecciona
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]); // Aquí ya guardamos el archivo directo
      setError(""); // Limpiamos errores previos
    }
  };

  // 2. Función para enviar la imagen a tu servidor FastAPI
  const handleUpload = async () => {
    if (!file) {
      alert("Por favor, selecciona una imagen primero.");
      return;
    }

    setLoading(true);
    setError("");

    const formData = new FormData();
    // CORREGIDO: Pasamos 'file' directamente porque ya contiene el archivo individual [0]
    formData.append("imagen", file); 

    try {
      // CORREGIDO: Añadida la ruta 'api/upload' al final de tu URL de Codespaces
      // ✅ Esto
      const backendUrl = import.meta.env.VITE_BACKEND_URL;
      console.log("Backend URL:", backendUrl); // Añade esto para verificar
      const response = await fetch(`${backendUrl}/api/upload`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setImageUrl(data.url); // Guardamos la URL de Cloudinary optimizada
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

  return (
    <div className="bg-white" style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h2>Sube una foto a tu Backend desde React</h2>
      
      {/* Input de archivo controlado por React */}
      <input 
        type="file" 
        accept="image/*" 
        onChange={handleFileChange} 
        disabled={loading}
      />
      
      {/* Botón de subida con estados visuales */}
      <button 
        onClick={handleUpload} 
        disabled={loading || !file}
        style={{ marginLeft: "10px", cursor: "pointer" }}
      >
        {loading ? "Subiendo..." : "Subir a Cloudinary"}
      </button>

      {/* Manejo de errores en pantalla */}
      {error && <p style={{ color: "red", marginTop: "15px" }}>{error}</p>}

      {/* Vista previa del resultado exitoso */}
     {imageUrl && (
        <div style={{ marginTop: "20px" }}>
          <p style={{ color: "green", fontWeight: "bold" }}>
            ¡Imagen guardada y optimizada con éxito!
          </p>
          <img 
            src={imageUrl} 
            alt="Resultado Cloudinary" 
            style={{ maxWidth: "300px", borderRadius: "8px", display: "block", marginBottom: "10px" }}
          />
          <p><strong>URL para tu Base de Datos:</strong></p>
          <code style={{ background: "#eee", padding: "5px", display: "block", wordBreak: "break-all" }}>
            {imageUrl}
          </code>
        </div>
      )}
    </div>
  );
}
