import React from "react";
import useAuthContext from "./useAuthContext";
import axios from "axios";

export const useLogin = () => {
  const [error, setError] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(null);
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
