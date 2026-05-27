import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";


const API = import.meta.env.VITE_BACKEND_URL


const Misplanes=()=>{


 const {store} = useGlobalReducer;
 const navigate = useNavigate();

 const [plans, setPlans] = useState([]);
 const [planActive, setPlanActive] = useState(null) ;
 const [loading,setLoading] = useState (false);
 const [error,setError] = useState (null) ;

 useEffect(()=>{

 const fetchPlanes = async () =>{
// mientras carga los planes esta en este estado
  setLoading(true);
  try {
    const token = localStorage.getItem("token");
    const resp = await fetch (`${API}/api/myplans`,{
        headers: { Authorization : `Bearer ${token}`}
    });
    const data =await resp.json
  } catch (error) {
    
    
  }




 }





 })









    return (
    <div>
        <h1>mis planes</h1>
    </div>
);

};



export default Misplanes;
