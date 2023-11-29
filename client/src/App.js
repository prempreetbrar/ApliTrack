import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import useAuthContext from "./hooks/useAuthContext";

import "./App.css";

import Signup from "./pages/Signup";
import Login from "./pages/Login";
import { useLogout } from "./hooks/useLogout";
import Profile from "./pages/Profile";
import Navbar from "./components/Navbar";

function App() {
  const { user } = useAuthContext();

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={
            user ? (
              <Navigate to="/applicants/profile" />
            ) : (
              <Navigate to="/auth/login" />
            )
          }
        />
        <Route
          path="/auth/signup"
          element={!user ? <Signup /> : <Navigate to="/applicants/profile" />}
        />
        <Route
          path="/auth/login"
          element={!user ? <Login /> : <Navigate to="/applicants/profile" />}
        />
        <Route
          path="/applicants/profile"
          element={user ? <Profile /> : <Navigate to="/auth/login" />}
        />
      </Routes>
    </Router>
  );
}

export default App;
