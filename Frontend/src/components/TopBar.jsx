// components/TopBar.jsx
import React, { useEffect } from "react";
import "../assets/style/Topbar.css";
import { IMAGES } from "../services/Constants";
import { useLocation, useNavigate } from "react-router";
import { Moon, Sun } from "lucide-react";

const TopBar = ({ darkMode, setDarkMode }) => {
  const navigate = useNavigate();
  const location = useLocation();

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

  const isLandingPage = location.pathname === "/";

  return (
    <div className="topbar-container">
      <div
        className="topbar-left"
        onClick={() => {
          if (isLandingPage) {
            navigate("/");
            window.location.reload();
            window.history.scrollRestoration = "manual";
            setTimeout(() => {
              window.scrollTo(0, 0);
            }, 300);
          } else {
            window.location.reload();
          }
        }}
      >
        <img className="topbar-logo" src={IMAGES.siteLogo} alt="" />
        <h1 className="topbar-title">ShapeSense AI</h1>
      </div>
      <div className="topbar-right">
        <nav className="topbar-nav">
          <a href="#features" className="topbar-link">
            Features
          </a>
          <a href="#workflow" className="topbar-link">
            Workflow
          </a>
          <a href="#why" className="topbar-link">
            Why AI
          </a>
          <a href="#tools" className="topbar-link">
            Tools
          </a>
          <a href="#testimonials" className="topbar-link">
            Success
          </a>
          <a href="#faq" className="topbar-link">
            FAQ
          </a>
          <a href="#about" className="topbar-link">
            About
          </a>
        </nav>
        <span
          onClick={() => {
            setDarkMode(!darkMode);
          }}
          className="icon icon-btn"
        >
          {darkMode ? <Sun /> : <Moon />}
        </span>
      </div>
    </div>
  );
};

export default TopBar;
