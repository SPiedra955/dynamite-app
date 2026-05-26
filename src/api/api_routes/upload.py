import os
import cloudinary
import cloudinary.uploader
from cloudinary.utils import cloudinary_url
from flask import Blueprint, request, jsonify

upload_api = Blueprint('upload_api', __name__)

cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET"),
    secure=True
)

@upload_api.route('/upload', methods=['POST'])
def upload_image():
    if 'imagen' not in request.files:
        return jsonify({"error": "No se encontró ningún archivo"}), 400

    file = request.files['imagen']

    if not file.content_type.startswith("image/"):
        return jsonify({"error": "El archivo no es una imagen válida"}), 400

    try:
        upload_result = cloudinary.uploader.upload(
            file,
            folder="usuarios_web"
        )

        public_id = upload_result.get("public_id")
        url_optimizada, _ = cloudinary_url(public_id, fetch_format="auto", quality="auto")

        return jsonify({
            "mensaje": "Imagen subida con éxito",
            "url": url_optimizada,
            "public_id": public_id
        }), 200

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": "Error al procesar la imagen"}), 500