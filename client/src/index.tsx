import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { AuthProvider } from "./contexts/AuthContext";
import { SnackbarProvider } from "notistack";

import WebFont from "webfontloader";
WebFont.load({ google: { families: ["Roboto:300,400,500"] } });

const root = ReactDOM.createRoot(document.getElementById("root"));
/*
  We want to be able to render Snackbars in any component in the app.
  In addition, we also want to be able to access the logged in user 
  from any component.
*/
root.render(
  <SnackbarProvider>
    <AuthProvider>
      <App />
    </AuthProvider>
  </SnackbarProvider>
);
