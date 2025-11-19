import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import TopBar from "../components/TopBar";

const AppLayout = () => {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className="main-content">
      <TopBar darkMode={darkMode} setDarkMode={setDarkMode} />
      <Outlet context={{ darkMode, setDarkMode }} />
    </div>
  );
};

export default AppLayout;
