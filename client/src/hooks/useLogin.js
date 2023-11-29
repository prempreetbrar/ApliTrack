import React from "react";
import useAuthContext from "./useAuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const useLogin = () => {
  const [error, setError] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(null);
  const navigate = useNavigate();
  const { dispatch } = useAuthContext();

  const login = async (data) => {
    setIsLoading(true);
    setError(null);
    let flag = false;

    await axios
      .post("http://localhost:3000/api/auth/login", {
        ...data,
      })
      .then((response) => {
        // save the user to LocalStorage
        localStorage.setItem("user", JSON.stringify(response.data));
        dispatch({ type: "LOGIN", payload: response.data });
        setIsLoading(false);
        setError(null);
        flag = true;

        /*
          wait 1 second before redirecting the user (just so they
          can see the success message)
        */
        setTimeout(() => navigate("/applicants/profile"), 1000);
      })
      .catch((error) => {
        setIsLoading(false);
        setError(error.response.data);
        flag = false;
      });

    return flag;
  };

  return { login, isLoading, error };
};
