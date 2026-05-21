import { Link } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

const Encuesta = () => {
  const { store, dispatch } = useGlobalReducer();
  return <div>Estas son las preguntas para generar un prompt</div>;
};

export default Encuesta;