import { Link } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { useNavigate } from "react-router-dom";
import services from "../services/apiServices";
import { useEffect } from "react";

export const Plans = () => {

  const { store, dispatch } = useGlobalReducer()
  const url = import.meta.env.VITE_BACKEND_URL;
  const token = localStorage.getItem("token")

  useEffect(() => {
    services.getSubscriptions().then(data => {
      dispatch({
        type: "getSubsPlan",
        payload: data.data
      });
    });
  }, []);

  const plans = store.subscriptionPlans || [];

  const handleBuy = async (plan) => {
    try {

      const res = await fetch(`${url}/api/create-subscription-checkout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: store.user.email,
          id: plan.id
        })
      });

      const data = await res.json();

      if (!data.url) {
        console.error("Error creando sesión Stripe", data);
        return;
      }

      window.location.href = data.url;

    } catch (error) {
      console.error("Error en pago:", error);
    }
  };


  return (
    <div className="bg-danger w-100 py-5">
      <div className="container">

        {/* Título */}
        <h1 className="text-white fw-bold mb-4">Nuestros planes</h1>

        <div className="row g-4">

          {plans.map((plan) => {
            return (
              <div key={plan.id} className="col-12 col-md-4">
                <div className="bg-dark rounded-4 p-4 h-100 d-flex flex-column">

                  <h2 className="text-white text-center mb-4">
                    {plan.name}
                  </h2>

                  <p className="text-white">
                    {plan.description}
                  </p>

                  <div className="text-center mt-auto">

                    <p className="text-white fw-bold fs-5">
                      Precio: {plan.price}€
                    </p>

                    <button
                      className="btn-secondary" onClick={() => handleBuy(plan)}
                    >Comprar</button>

                  </div>

                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  )
}

export default Plans;