import React, { useEffect, useState } from "react";
import API from "../utils/api";
import { toast } from "sonner";
import { IMAGES } from "../services/Constants";
import { useAuth } from "../context/AuthContext";
import "../assets/style/DashBoard.css";
import { FormatResponse } from "../components/FormatResponse";
import {
  activityData,
  goalsData,
  heartBaetStatus,
  monthlyProgressData,
  myScheduleData,
  PeriodZone,
} from "../services/DashboardServices";

const Dashboard = () => {
  const { currentUser } = useAuth();
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const res = await API.get("/plan/get-plans");
      setPlans(res?.data?.plans || []);
    } catch (error) {
      console.error("Error fetching plans:", error);
      toast.error("Failed to fetch plans");
    }
  };

  return (
    <div className="dashboard-main-container">
      <header className="dashboard-header">
        <div className="dashboard-header-left">
          <h1 className="dashboard-title">Good {PeriodZone()} 🎉</h1>
          <div className="dashboard-user-stats">
            <div className="dashboard-stat-box">
              <span className="dashboard-stat-number">
                {currentUser?.weight}kg
              </span>
              <span className="dashboard-stat-label">Weight</span>
            </div>
            <div className="dashboard-stat-box">
              <span className="dashboard-stat-number">
                {currentUser?.height}cm
              </span>
              <span className="dashboard-stat-label">Height</span>
            </div>
            <div className="dashboard-stat-box">
              <span className="dashboard-stat-number">
                {currentUser?.age}yrs
              </span>
              <span className="dashboard-stat-label">Age</span>
            </div>
          </div>
        </div>

        <div className="dashboard-heartbeat">
          <span className="dashboard-heartbeat-title">Heart Beat</span>
          <span className="dashboard-heartbeat-value">{heartBaetStatus()}</span>
          <div className="dashboard-heartbeat-wave"></div>
          <span className="dashboard-heartbeat-status">Normal</span>
        </div>
        <div className="dashboard-image">
          <img
            src={
              currentUser?.gender === "male"
                ? IMAGES.slideImage3
                : IMAGES.FemaleLabel
            }
            alt=""
          />
        </div>
      </header>

      <main className="dashboard-grid">
        {/* Activity */}
        <div className="card activity-card">
          <h3 className="card-title">Activity</h3>
          <div className="activity-bars">
            {activityData.map((item, index) => (
              <div key={index} className="activity-item">
                <div
                  className={`bar ${item.day === "Fri" ? "active-bar" : ""}`}
                ></div>
                <span className="bar-label">{item.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Monthly Progress */}
        <div className="card progress-card">
          <h3 className="card-title">Monthly Progress</h3>

          <div className="progress-circle">
            <div className="inner-circle">
              <span>{monthlyProgressData()}%</span>
            </div>
          </div>

          <p className="progress-note">
            You have achieved <b>{monthlyProgressData()}%</b> of your goal this
            month
          </p>
        </div>

        {/* Goals */}
        <div className="card goals-card">
          <div className="card-header">
            <h3 className="card-title">Goals</h3>
            <span className="view-all">View All</span>
          </div>

          {goalsData.map((g, i) => (
            <div key={i} className="goal-row">
              <div className="goal-info">
                <h4>{g.type}</h4>
                <span>{g.at}</span>
              </div>
              <span className="goal-value">{g.value}</span>
            </div>
          ))}
        </div>

        {/* Schedule */}
        <div className="card schedule-card">
          <div className="card-header">
            <h3 className="card-title">My Schedule</h3>
            <span className="view-all">View All</span>
          </div>

          {myScheduleData.map((s, i) => (
            <div key={i} className="schedule-row">
              <div className="schedule-info">
                <h4>{s.type}</h4>
                <span>{s.at}</span>
              </div>
              <span className="schedule-value">{s.value}</span>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
