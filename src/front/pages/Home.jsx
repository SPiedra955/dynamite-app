import React, { useEffect } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { CheckSub } from "../components/CheckSub.jsx";
import { Slide } from "../components/Slide";
import { Card } from "../components/Card";
import  Plans  from "../components/Plans";
import { Separator } from "../components/Separator";
import { ProfileImageUploader } from "../components/ProfileImageUploader";

export const Home = () => {
  const { store, dispatch } = useGlobalReducer();

  const loadMessage = async () => {
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL;
      if (!backendUrl) throw new Error("VITE_BACKEND_URL is not defined in .env file");
      const response = await fetch(backendUrl + "/api/hello");
      const data = await response.json();
      if (response.ok) dispatch({ type: "set_hello", payload: data.message });
      return data;
    } catch (error) {
      console.error(error);
      throw new Error("Could not fetch the message from the backend.");
    }
  };

  useEffect(() => {
    loadMessage();
  }, []);

  return (
  <div>
    <Slide />
    <Card />
    <div id="plans"> 
      <Plans />
    </div>
    <Separator />
  </div>
);
};