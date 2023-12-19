import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import useAuthContext from "./hooks/useAuthContext";

import "./App.css";

import Signup from "./pages/auth/Signup";
import Login from "./pages/auth/Login";
import Profile from "./pages/profile/Profile";
import Navbar from "./components/Navbar";
import Interview from "pages/Interviews";
import Contacts from "pages/Contacts";
import Companies from "pages/Companies";
import Applications from "pages/Applications";
import Offers from "pages/Offers";
import Documents from "pages/Documents";
import Users from "pages/Users";
import { Box, CircularProgress } from "@mui/joy";
import ForgotPassword from "pages/auth/ForgotPassword";
import ResetPassword from "pages/auth/ResetPassword";

function App() {
  const { user, isLoading } = useAuthContext();
  if (isLoading) {
    return (
      <Box display="flex" alignItems="center" justifyContent="center">
        <CircularProgress />;
      </Box>
    );
  }

  console.log(user);
  /*
    If the user isn't logged in, then navigate them to the login page on a protected route.
    Otherwise, if they are logged in, let them see the protected route.
  */
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={
            user ? (
              <Navigate to="/applicants/applicant/profile" />
            ) : (
              <Navigate to="/auth/login" />
            )
          }
        />
        <Route
          path="/auth/signup"
          element={
            !user ? <Signup /> : <Navigate to="/applicants/applicant/profile" />
          }
        />
        <Route
          path="/auth/login"
          element={
            !user ? <Login /> : <Navigate to="/applicants/applicant/profile" />
          }
        />
        <Route
          path="/auth/forgot-password"
          element={
            !user ? (
              <ForgotPassword />
            ) : (
              <Navigate to="/applicants/applicant/profile" />
            )
          }
        />
        <Route
          path="/auth/reset-password/:Username/:Token"
          element={
            !user ? (
              <ResetPassword />
            ) : (
              <Navigate to="/applicants/applicant/profile" />
            )
          }
        />
        <Route
          path="/applicants/applicant/profile"
          element={user ? <Profile /> : <Navigate to="/auth/login" />}
        />
        <Route path="/applicants/applicant/offers" element={<Offers />} />
        <Route
          path="/applicants/applicant/interviews"
          element={user ? <Interview /> : <Navigate to="/auth/login" />}
        />
        <Route
          path="/applicants/applicant/documents"
          element={user ? <Documents /> : <Navigate to="/auth/login" />}
        />
        <Route path="/contacts" element={<Contacts />} />
        <Route path="/companies" element={<Companies />} />
        <Route
          path="/applicants/applicant/applications"
          element={user ? <Applications /> : <Navigate to="/auth/login" />}
        />
        <Route
          path="/users"
          element={
            user && user.data.user.AdminFlag ? (
              <Users />
            ) : (
              <Navigate to="/auth/login" />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
