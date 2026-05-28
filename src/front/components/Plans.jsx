import { Link } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { useNavigate } from "react-router-dom";
import services from "../services/apiServices";
import { useEffect } from "react";
import Swal from "sweetalert2";

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

      if (!token) {
        Swal.fire({
          icon: "warning",
          title: "Debes iniciar sesión",
          text: "Inicia sesión para continuar con la compra",
          confirmButtonColor: "#dc3545",
        });

        return;
      }

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
      <div className="container" id="plans">
        <h1 className="text-white fw-bold mb-4">
          Nuestros planes
        </h1>
        <div className="row g-4">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className="col-12 col-md-4"
            >
              <div className="bg-dark rounded-4 p-4 h-100 d-flex flex-column">
                <h2 className="text-white text-center mb-4 fs-4 fs-md-2">
                  {plan.name}
                </h2>
                <div
                  className="text-white"
                  dangerouslySetInnerHTML={{
                    __html: plan.description
                  }}
                />
                <div className="text-center mt-auto pt-4">
                  <p className="text-white fw-bold fs-5">
                    Precio: {plan.price}€
                  </p>
                  <button
                    className="btn btn-danger rounded-pill px-5"
                    onClick={() => handleBuy(plan)}
                  >
                    Comprar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}

export default Plans;