import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { SnackbarProvider, enqueueSnackbar } from "notistack";
import "./App.css";
import { AuthProvider } from "./contexts/AuthContext";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import { useLogout } from "./hooks/useLogout";
import Profile from "./pages/Profile";
import Navbar from "./components/Navbar";

function App() {
  return (
    <SnackbarProvider>
      <AuthProvider>
        <Router>
          <Navbar />
          <Routes>
            <Route path="/auth/signup" element={<Signup />} />
            <Route path="/auth/login" element={<Login />} />
            <Route path="/applicants/profile" element={<Profile />} />
          </Routes>
        </Router>
      </AuthProvider>
    </SnackbarProvider>
  );
}

export default App;
