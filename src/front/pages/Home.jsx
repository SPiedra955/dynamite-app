import React, { useEffect } from "react";
import rigoImageUrl from "../assets/img/rigo-baby.jpg";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import Calendar from "../components/Calendar.jsx";

export const Home = () => {
  const { store, dispatch } = useGlobalReducer();

  const loadMessage = async () => {
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL;

      if (!backendUrl)
        throw new Error("VITE_BACKEND_URL is not defined in .env file");

      const response = await fetch(backendUrl + "/api/hello");
      const data = await response.json();

      if (response.ok) dispatch({ type: "set_hello", payload: data.message });

      return data;
    } catch (error) {
      if (error.message)
        throw new Error(
          `Could not fetch the message from the backend.
				Please check if the backend is running and the backend port is public.`,
        );
    }
  };

  useEffect(() => {
    loadMessage();
  }, []);

  return (
    <div className="bg-dark p-5">
      <p className="text-light">
        Lorem Ipsum is simply dummy text of the printing 
        and typesetting industry. Lorem Ipsum has been the 
        industry's standard dummy text ever since the 1500s, 
        when an unknown printer took a galley of type and 
        scrambled it to make a type specimen book. It has 
        survived not only five centuries, but also the leap 
        into electronic typesetting, remaining essentially unchanged. 
        It was popularised in the 1960s with the release of Letraset 
        sheets containing Lorem Ipsum passages, and more recently with 
        desktop publishing software like Aldus PageMaker including 
        versions of Lorem Ipsum.
      </p>
     
    </div>
  );
};
