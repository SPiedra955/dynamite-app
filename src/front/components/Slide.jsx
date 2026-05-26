import { Link } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { useNavigate } from "react-router-dom";

export const Slide = () => (

  <div className="w-100 d-flex align-items-center justify-content-center position-relative"
      style={{
        backgroundImage: "url('https://res.cloudinary.com/dr5mzsq8w/image/upload/f_auto,q_auto/v1/usuarios_web/aldndchyikd22ilb2tsw')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "500px",
      }}
    >
  <div className="w-100 d-flex align-items-center justify-content-center"
    style={{ backgroundColor: "rgba(0,0,0,0.4)" , minHeight: "500px",}}
  >
    <div className="d-flex flex-column align-items-center justify-content-center py-5 px-3 px-md-5">
      <h1 className="text-white text-center fw-bold fs-2 fs-md-1 pt-4">
        EXPLOTA TODO TU POTENCIAL
      </h1>
      <p className="text-center text-white my-3 fs-5 fs-md-3">
        Nuestros planes completamente personalizados harán volar a otro nivel
      </p>
      <Link to="/subscription-plans">
        <button className="btn btn-danger rounded-pill px-4 px-md-5 m-3">
          Saber más
        </button>
      </Link>
    </div>
  </div>
</div>

);


export default Slide