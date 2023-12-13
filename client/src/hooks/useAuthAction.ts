import React from "react";
import useAuthContext from "./useAuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const useAuthAction = (apiEndpoint) => {
  const [error, setError] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(null);
  const navigate = useNavigate();
  const { dispatch } = useAuthContext();

  const authAction = async (data) => {
    setIsLoading(true);
    setError(null);
    let flag = null;

    try {
      const response = await axios.post(apiEndpoint, {
        ...data,
      });
      localStorage.setItem("user", JSON.stringify(response.data));
      dispatch({ type: "LOGIN", payload: response.data });
      setIsLoading(false);
      /*
          wait 1 second before redirecting the user (just so they
          can see the success message)
        */
      setTimeout(() => navigate("/applicants/applicant/profile"), 1000);
      flag = true;
    } catch (error) {
      setIsLoading(false);
      setError(error.response.data);
      flag = false;
    }
    return flag;
  };

  return { authAction, isLoading, error };
};

export const useLogin = () => {
  return useAuthAction("http://localhost:3000/api/auth/login");
};

export const useSignup = () => {
  return useAuthAction("http://localhost:3000/api/auth/signup");
};
