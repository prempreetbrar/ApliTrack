import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { SnackbarProvider, enqueueSnackbar } from "notistack";
import "./App.css";
import { AuthProvider } from "./contexts/AuthContext";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import { useLogout } from "./hooks/useLogout";

function App() {
  return (
    <SnackbarProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </Router>
      </AuthProvider>
    </SnackbarProvider>
  );
}

export default App;
