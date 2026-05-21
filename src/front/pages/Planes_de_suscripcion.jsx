import { Link } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

const Planes_de_suscripcion = () => {
  const { store, dispatch } = useGlobalReducer();
  return 
  <div className="bg-dark text-light">planes de suscripcion</div>;
};

export default Planes_de_suscripcion;