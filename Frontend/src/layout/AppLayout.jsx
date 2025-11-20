import React, { use, useState } from "react";
import { Outlet } from "react-router-dom";
import TopBar from "../components/TopBar";
import Login from "../auth/Login";
import Signup from "../auth/Signup";
import { useAuth } from "../context/AuthContext";
import Loader from "../components/Loader";

const AppLayout = () => {
  const { loading } = useAuth();
  const [acountState, setAcountState] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [currentSection, setCurrentSection] = useState("/");

  if (loading)
    return (
      <Loader
        size="70"
        style={{ height: "100vh", backgroundColor: "var(--backGroundColor)" }}
      />
    );

  return (
    <div className="main-content">
      {acountState === "login" && <Login setAcountState={setAcountState} />}
      {acountState === "signUp" && <Signup setAcountState={setAcountState} />}
      <TopBar
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        acountState={acountState}
        setAcountState={setAcountState}
        currentSection={currentSection}
        setCurrentSection={setCurrentSection}
      />
      <Outlet
        context={{
          darkMode,
          setDarkMode,
          acountState,
          setAcountState,
          currentSection,
          setCurrentSection,
        }}
      />
    </div>
  );
};

export default AppLayout;
