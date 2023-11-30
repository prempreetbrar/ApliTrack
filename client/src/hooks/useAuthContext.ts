import React from "react";
import { AuthContext } from "../contexts/AuthContext";

export default function useAuthContext() {
  const context = React.useContext(AuthContext);

  if (!context) {
    throw Error("useAuthContext must be used inside a AuthContextProvider");
  }
  return context;
}
