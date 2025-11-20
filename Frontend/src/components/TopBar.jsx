// components/TopBar.jsx
import React, { useEffect, useState } from "react";
import "../assets/style/Topbar.css";
import { IMAGES, sectionList } from "../services/Constants";
import { useAuth } from "../context/AuthContext";
import { useLocation, useNavigate } from "react-router";
import { ChevronLeft, Menu, Moon, Sun, X } from "lucide-react";
import { useGoBack, userType } from "../services/Helpers";

const TopBar = ({ darkMode, setDarkMode, setAcountState, currentSection }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useAuth();
  const [isSidebar, setIsSidebar] = useState(false);
  const [usersType, setUsersType] = useState("");

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

  const goBack = useGoBack();

  useEffect(() => {
    const data = userType(currentUser);
    setUsersType(data);
  }, [currentUser]);

  return (
    <>
      {isLandingPage ? (
        <div className="topbar-container">
          <div className="topbar-left">
            <div
              className="topbar-left-btn"
              onClick={() => {
                window.location.reload();
              }}
            >
              <img className="topbar-logo" src={IMAGES.siteLogo} alt="" />
              <h1 className="topbar-title">ShapeSense AI</h1>
            </div>
          </div>
          <div className="topbar-right">
            <nav className="topbar-nav">
              {sectionList.slice(1).map((section, index) => (
                <a
                  key={index}
                  href={`#${section}`}
                  className={`topbar-link mobile-sidebar-link ${
                    currentSection === section ? "activeLink" : ""
                  }`}
                >
                  {section}
                </a>
              ))}
            </nav>
            <span
              onClick={() => {
                setDarkMode(!darkMode);
              }}
              className="icon icon-btn"
            >
              {darkMode ? <Sun /> : <Moon />}
            </span>
            {usersType === "noUser" ? (
              <button
                onClick={() => {
                  setAcountState("login");
                }}
                className="topbar-login-btn"
              >
                Login
              </button>
            ) : (
              <button
                onClick={() => {
                  navigate(`/user-details/${currentUser?._id}`);
                }}
                className="topbar-user-btn"
              >
                <img
                  src={currentUser?.profileImg || IMAGES.PlaceHolder}
                  alt=""
                />
              </button>
            )}
            <button
              onClick={() => setIsSidebar(true)}
              className="topbar-left-back-btn topbar-menu-btn"
            >
              <span className="icon">
                <Menu />
              </span>
            </button>
          </div>
        </div>
      ) : (
        <div className="topbar-container">
          <div className="topbar-left">
            <button onClick={goBack} className="topbar-left-back-btn">
              <span className="icon">
                <ChevronLeft />
              </span>
            </button>
            <div
              className="topbar-left-btn"
              onClick={() => {
                window.location.reload();
              }}
            >
              <img className="topbar-logo" src={IMAGES.siteLogo} alt="" />
              <h1 className="topbar-title">ShapeSense AI</h1>
            </div>
          </div>
          <div className="topbar-right">
            <span
              onClick={() => {
                setDarkMode(!darkMode);
              }}
              className="icon icon-btn"
              style={{display:"flex"}}
            >
              {darkMode ? <Sun /> : <Moon />}
            </span>
            {usersType === "noUser" ? (
              <button
                onClick={() => {
                  setAcountState("login");
                }}
                className="topbar-login-btn"
              >
                Login
              </button>
            ) : (
              <button
                onClick={() => {
                  navigate(`/user-details/${currentUser?._id}`);
                }}
                className="topbar-user-btn"
              >
                <img
                  src={currentUser?.profileImg || IMAGES.PlaceHolder}
                  alt=""
                />
              </button>
            )}
          </div>
        </div>
      )}
      <div
        className={`mobile-sidebar-container ${
          isSidebar ? "sidebarOpen" : "sidebarClose"
        }`}
      >
        <div className="mobile-sidebar-header">
          <div>
            <img className="mobile-sidebar-logo" src={IMAGES.siteLogo} alt="" />
            <h1 className="mobile-sidebar-title">ShapeSense AI</h1>
          </div>
          <div>
            <button
              onClick={() => setIsSidebar(false)}
              className="topbar-left-back-btn topbar-menu-btn"
            >
              <span className="icon">
                <X />
              </span>
            </button>
            <button
              onClick={() => {
                setDarkMode(!darkMode);
              }}
              style={{ marginTop: "4px" }}
              className="topbar-left-back-btn sidebar-darkmode-btn"
            >
              <span className="icon">{darkMode ? <Sun /> : <Moon />}</span>
            </button>
          </div>
        </div>
        <nav className="mobile-sidebar-nav">
          {sectionList.slice(1).map((section, index) => (
            <a
              key={index}
              href={`#${section}`}
              className={`mobile-sidebar-link ${
                currentSection === section ? "activeLink" : ""
              }`}
            >
              {section}
            </a>
          ))}
        </nav>
      </div>
    </>
  );
};

export default TopBar;
