import { Link } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

const Tienda = () => {
  const { store, dispatch } = useGlobalReducer();
  return <div>Tienda</div>;
};

export default Tienda;