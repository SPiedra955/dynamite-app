import { Link } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { useNavigate } from "react-router-dom";

export const Slide = () => (

  <div className="slide-bg w-100 d-flex align-items-center justify-content-center position-relative">
    <div className="slide-overlay w-100 d-flex align-items-center justify-content-center">
      <div className="d-flex flex-column align-items-center justify-content-center py-5 px-3 px-md-5">
        <h1 className="text-white text-center fw-bold fs-2 fs-md-1 pt-4">
          EXPLOTA TU POTENCIAL
        </h1>
        <p className="text-center text-white my-3 fs-5 fs-md-3">
          Nuestros planes completamente personalizados te harán volar a otro nivel
        </p>
        <a href="#plans" className="btn btn-danger rounded-pill px-5">
          Comprar
        </a>
      </div>
    </div>
  </div>

);


export default Slide