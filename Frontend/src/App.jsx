import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import "./assets/style/Style.css";
import AppLayout from "./layout/AppLayout.jsx";
import LandingPage from "./pages/LandingPage.jsx";
import UserDetails from "./auth/UserDetails.jsx";
import DashBoard from "./pages/DashBoard.jsx";
import { ProtectedRoute } from "./routes/ProtectedRoute.jsx";

const App = () => {

  return (
    <>
      <Routes>
        <Route element={<AppLayout />}>
          <Route
            path="/"
            element={
              <ProtectedRoute
                allowedTypes={["noUser", "notVerified", "verified"]}
              >
                <LandingPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user-details/:id"
            element={
              <ProtectedRoute allowedTypes={["notVerified", "verified"]}>
                <UserDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/:id"
            element={
              <ProtectedRoute allowedTypes={["verified"]}>
                <DashBoard />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </>
  );
};

export default App;
