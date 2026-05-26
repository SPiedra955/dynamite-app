import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { Plans } from "../components/Plans"
import { Navbar } from "../components/Navbar";

export const Subscription_plans = () => {
    return (
        <ScrollToTop>    
          <Navbar />                 
          <Plans /> 
          <Footer />        
        </ScrollToTop>
    )
};