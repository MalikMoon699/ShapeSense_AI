import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import "./assets/style/Style.css";
import AppLayout from "./layout/AppLayout.jsx";
import LandingPage from "./pages/LandingPage.jsx";
import UserDetails from "./auth/UserDetails.jsx";
import DashBoard from "./pages/DashBoard.jsx";
import Schedule from "./pages/Schedule.jsx";
import Achievements from "./pages/Achievements.jsx";
import WorkoutPlan from "./pages/WorkoutPlan.jsx";
import Chatbot from "./pages/Chatbot.jsx";
import { ProtectedRoute } from "./routes/ProtectedRoute.jsx";
import UserLayout from "./layout/UserLayout.jsx";

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
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
        <Route element={<UserLayout />}>
          <Route
            path="/dashboard/:id"
            element={
              <ProtectedRoute allowedTypes={["verified"]}>
                <DashBoard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/schedule/:id"
            element={
              <ProtectedRoute allowedTypes={["verified"]}>
                <Schedule />
              </ProtectedRoute>
            }
          />
          <Route
            path="/achievements/:id"
            element={
              <ProtectedRoute allowedTypes={["verified"]}>
                <Achievements />
              </ProtectedRoute>
            }
          />
          <Route
            path="/workout-plan/:id"
            element={
              <ProtectedRoute allowedTypes={["verified"]}>
                <WorkoutPlan />
              </ProtectedRoute>
            }
          />
          <Route
            path="/chatbot"
            element={
              <ProtectedRoute allowedTypes={["verified"]}>
                <Chatbot />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/dashboard/:id" replace />} />
        </Route>
      </Routes>
    </>
  );
};

export default App;
