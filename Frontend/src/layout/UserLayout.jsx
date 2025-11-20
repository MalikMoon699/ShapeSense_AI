import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Loader from "../components/Loader";
import UserSidebar from "../components/UserSidebar";

const UserLayout = () => {
  const { loading } = useAuth();
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedMode = localStorage.getItem("darkMode");
    if (savedMode === "true") {
      setDarkMode(true);
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      setDarkMode(false);
      document.documentElement.setAttribute("data-theme", "light");
    }
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.setAttribute("data-theme", "dark");
      localStorage.setItem("darkMode", "true");
    } else {
      document.documentElement.setAttribute("data-theme", "light");
      localStorage.setItem("darkMode", "false");
    }
  }, [darkMode]);

  if (loading)
    return (
      <Loader
        size="70"
        style={{ height: "100vh", backgroundColor: "var(--backGroundColor)" }}
      />
    );

  return (
    <div className="main-content">
      <UserSidebar darkMode={darkMode} setDarkMode={setDarkMode} />
      <div className="users-main-container">
        <Outlet context={{}} />
      </div>
    </div>
  );
};

export default UserLayout;
