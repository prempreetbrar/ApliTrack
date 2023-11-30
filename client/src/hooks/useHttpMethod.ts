import React from "react";
import useAuthContext from "./useAuthContext";
import axios from "axios";
import { useSnackbar } from "notistack";

const useHttpMethod = (method) => {
  const [error, setError] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(null);
  const { user } = useAuthContext();
  const { enqueueSnackbar } = useSnackbar();

  const executeRequest = async (data, url, config = {}) => {
    setIsLoading(true);
    setError(null);

    console.log(data);
    try {
      if (method === "delete") {
        config.data = data;
      }

      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${user.token}`,
      };

      let response;

      if (method === "get" || method === "delete") {
        response = await axios[method](url, config);
      } else {
        response = await axios[method](url, data, config);
      }

      if (method !== "get") {
        enqueueSnackbar(`Success!`, {
          variant: "success",
          autoHideDuration: 1000,
        });
      }

      setIsLoading(false);
      setError(null);

      if (method === "delete") {
        return response;
      } else {
        return response.data.data;
      }
    } catch (error) {
      setIsLoading(false);
      setError(error?.response?.data.message);

      enqueueSnackbar(error.response?.data.message, {
        variant: "error",
        autoHideDuration: 1000,
      });
      return null;
    }
  };

  return { executeRequest, isLoading, error };
};

export const useCreate = () => useHttpMethod("post");
export const useUpdate = () => useHttpMethod("patch");
export const useDelete = () => useHttpMethod("delete");
export const useGet = () => useHttpMethod("get");