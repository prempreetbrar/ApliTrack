import React from "react";
import useAuthContext from "./useAuthContext";
import axios from "axios";

export const useDelete = () => {
  const [error, setError] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(null);
  const { user } = useAuthContext();

  const deleteItem = async (data, url) => {
    setIsLoading(true);
    setError(null);
    let flag = false;

    await axios
      .delete(
        url,
        {
          data: { ...data },
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      )
      .then((response) => {
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

  return { deleteItem, isLoading, error };
};
