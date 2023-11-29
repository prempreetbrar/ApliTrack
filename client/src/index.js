import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { AuthProvider } from "./contexts/AuthContext";
import { SnackbarProvider, enqueueSnackbar } from "notistack";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <SnackbarProvider>
    <AuthProvider>
      <App />
    </AuthProvider>
  </SnackbarProvider>
);
