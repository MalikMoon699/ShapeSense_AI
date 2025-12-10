import React, { useState } from "react";
import "../assets/style/UserSidebar.css";
import {
  Bot,
  ChevronLeft,
  ChevronRight,
  ClipboardClock,
  Dumbbell,
  LayoutDashboard,
  LogOut,
  Moon,
  Sun,
  Trophy,
  X,
} from "lucide-react";
import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { IMAGES } from "../services/Constants";

const UserSidebar = ({ setDarkMode, darkMode }) => {
  const { currentUser, logout } = useAuth();
  const [isSidebar, setIssidebar] = useState(false);
  const navigate = useNavigate();

  const isActiveRoute = (route) => {
    return window.location.pathname.startsWith(route);
  };

  return (
    <div>
      <span
        onClick={() => {
          setIssidebar(!isSidebar);
        }}
        style={{ left: isSidebar ? "259px" : "0px" }}
        className="sidebar-switch-btn icon"
      >
        {isSidebar ? <ChevronLeft /> : <ChevronRight />}
      </span>
      <div
        className={`user-sidebar-container user-sidebar-container-${
          isSidebar ? "open" : "close"
        }`}
      >
        <div className="user-sidebar-content">
          <div className="user-sidebar-header">
            <div>
              <div className="user-sidebar-logo">
                <img src={IMAGES.siteLogo} alt="" />
              </div>
              <h2 className="user-sidebar-title">ShapeSense</h2>
            </div>
            <div>
              <button
                onClick={() => {
                  navigate("/");
                }}
                className="topbar-left-back-btn"
              >
                <span className="icon">
                  <ChevronLeft />
                </span>
              </button>
              <button
                style={{ marginTop: "4px", display: "flex" }}
                onClick={() => {
                  setDarkMode(!darkMode);
                }}
                className="topbar-left-back-btn topbar-menu-btn"
              >
                <span className="icon">{darkMode ? <Sun /> : <Moon />}</span>
              </button>
            </div>
          </div>

          <ul className="user-sidebar-menu">
            <li
              className={`user-sidebar-item ${
                isActiveRoute(`/dashboard`) ? "active" : ""
              }`}
              onClick={() => {
                navigate(`/dashboard/${currentUser?._id}`);
                setIssidebar(false);
              }}
            >
              <span className="user-sidebar-icon icon">
                <LayoutDashboard />
              </span>
              Dashboard
            </li>
            <li
              className={`user-sidebar-item ${
                isActiveRoute(`/schedule`) ? "active" : ""
              }`}
              onClick={() => {
                navigate(`/schedule/${currentUser?._id}`);
                setIssidebar(false);
              }}
            >
              <span className="user-sidebar-icon icon">
                <ClipboardClock />
              </span>
              Schedule
            </li>

            <li
              className={`user-sidebar-item ${
                isActiveRoute(`/workout-plan`) ? "active" : ""
              }`}
              onClick={() => {
                navigate(`/workout-plan/${currentUser?._id}`);
                setIssidebar(false);
              }}
            >
              <span className="user-sidebar-icon">
                <span className="user-sidebar-icon icon">
                  <Dumbbell />
                </span>
              </span>
              Workout Plan
            </li>
            <li
              className={`user-sidebar-item ${
                isActiveRoute(`/achievements`) ? "active" : ""
              }`}
              onClick={() => {
                navigate(`/achievements/${currentUser?._id}`);
                setIssidebar(false);
              }}
            >
              <span className="user-sidebar-icon">
                <span className="user-sidebar-icon icon">
                  <Trophy />
                </span>
              </span>
              Achievements
            </li>
            <li
              className={`user-sidebar-item ${
                isActiveRoute(`/coach`) ? "active" : ""
              }`}
              onClick={() => {
                navigate("/coach");
                setIssidebar(false);
              }}
            >
              <span className="user-sidebar-icon">
                <span className="user-sidebar-icon icon">
                  <Bot />
                </span>
              </span>
              Ask any Question
            </li>
          </ul>
        </div>
        <div className="user-sidebar-footer">
          <button onClick={logout}>
            Logout
            <span className="icon">
              <LogOut />
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserSidebar;
