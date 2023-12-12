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

function App() {
  const { user } = useAuthContext();

  if (user?.token === undefined) {
    return null;
  }
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
        <Route path="/applications" element={<Applications />} />
      </Routes>
    </Router>
  );
}

export default App;
