import React from "react";

export const AuthContext = React.createContext(null);
export const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      return { user: action.payload, isLoading: false };
    case "LOGOUT":
      return { user: null, isLoading: false };
    default:
      return state;
  }
};

/*
  We "provide" the children with authentication context.
*/
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = React.useReducer(authReducer, {
    // to begin with, the user is not logged in; we have no user.
    user: null,
    isLoading: true,
  });

  React.useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      dispatch({ type: "LOGIN", payload: user });
    } else {
      dispatch({ type: "LOGOUT" });
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        ...state,
        dispatch,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
