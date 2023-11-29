import useAuthContext from "./useAuthContext";
import { useNavigate } from "react-router-dom";

export const useLogout = () => {
  const { dispatch } = useAuthContext();
  const navigate = useNavigate();

  const logout = () => {
    // remove user from storage
    localStorage.removeItem("user");

    dispatch({ type: "LOGOUT" });

    /*
          wait 1 second before redirecting the user (so they
            can see the logout happening)
        */
    setTimeout(() => navigate("/auth/login"), 1000);
  };

  return { logout };
};
