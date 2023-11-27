import React from "react";

export const AuthContext = React.createContext(null);
export const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      return { user: action.payload };
    case "LOGOUT":
      return { user: null };
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
  });

  console.log("AuthContext state: ", state);

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
