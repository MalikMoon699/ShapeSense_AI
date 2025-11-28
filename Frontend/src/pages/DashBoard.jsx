import React, { useEffect, useState } from "react";
import API from "../utils/api";
import { toast } from "sonner";
import { IMAGES } from "../services/Constants";
import { useAuth } from "../context/AuthContext";
import "../assets/style/DashBoard.css";
import Loader from "../components/Loader";
import {
  formatDashBoardAchievements,
  formatDashBoardPlans,
  formatDashBoardWorkouts,
  FormatResponse,
} from "../components/FormatResponse";
import { PeriodZone } from "../services/DashboardServices";
import {
  fetchPlans,
  fetchWorkout,
  fetchAchievements,
} from "../services/Helpers";
import { useNavigate } from "react-router";
import ActivityChart from "../components/ActivityBarChart";

const Dashboard = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [dumLoading, setDumLoading] = useState(true);
  const [workouts, setWorkouts] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await fetchWorkout(setDumLoading, setWorkouts);
      await fetchAchievements(setDumLoading, setAchievements);
      await fetchPlans(setDumLoading, setPlans);
      setLoading(false);
    };
    loadData();
  }, []);

  const workoutData = formatDashBoardWorkouts(workouts);
  const achievementData = formatDashBoardAchievements(achievements);
  const scheduleData = formatDashBoardPlans(plans);

  return (
    <div className="dashboard-main-container">
      <header className="dashboard-header">
        <div className="dashboard-header-left">
          <h1 className="dashboard-title">Good {PeriodZone()} 🎉</h1>
          <div className="dashboard-user-stats">
            <div className="dashboard-stat-box">
              <strong className="dashboard-stat-label">Weight:</strong>
              <span className="dashboard-stat-number">
                {currentUser?.weight}kg
              </span>
            </div>
            <div className="dashboard-stat-box">
              <strong className="dashboard-stat-label">Height:</strong>
              <span className="dashboard-stat-number">
                {currentUser?.height}cm
              </span>
            </div>
            <div className="dashboard-stat-box">
              <strong className="dashboard-stat-label">Age:</strong>
              <span className="dashboard-stat-number">
                {currentUser?.age}yrs
              </span>
            </div>
          </div>
        </div>

        <div
          className={`dashboard-image ${
            currentUser?.gender === "male" ? "male" : "female"
          }`}
        >
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
        <div className="card activity-card">
          <h3 className="card-title">Activity</h3>
          {loading ? (
            <Loader style={{ height: "200px" }} />
          ) : (
            <ActivityChart
              achievements={achievements}
              workoutData={workoutData}
            />
          )}
        </div>

        <div className="card schedule-card">
          <div className="card-header">
            <h3 className="card-title-2">My Schedule</h3>
            <span
              onClick={() => {
                navigate("");
              }}
              className="view-all"
            >
              View All
            </span>
          </div>
          {loading ? (
            <Loader style={{ height: "200px" }} />
          ) : scheduleData.length === 0 ? (
            <p className="no-data">No schedule to show</p>
          ) : (
            (scheduleData.length > 3
              ? scheduleData.slice(1, 3)
              : scheduleData
            ).map((s, i) => (
              <div key={i} className="schedule-row">
                <div className="schedule-info">
                  <h4>{s.type}</h4>
                  <span>{s.at}</span>
                </div>
                <span className="schedule-value">{s.value}</span>
              </div>
            ))
          )}
        </div>

        <div className="card goals-card">
          <div className="card-header">
            <h3 className="card-title-2">Workout Plan</h3>
            <span className="view-all">View All</span>
          </div>
          {loading ? (
            <Loader style={{ height: "200px" }} />
          ) : workoutData.length === 0 ? (
            <p className="no-data">No workouts to show</p>
          ) : (
            (workoutData.length > 3
              ? workoutData.slice(1, 3)
              : workoutData
            ).map((g, i) => (
              <div key={i} className="goal-row">
                <div className="goal-info">
                  <h4>{g.type}</h4>
                  <span>{g.at}</span>
                </div>
                <span className="goal-value">{g.value}</span>
              </div>
            ))
          )}
        </div>

        <div className="card goals-card">
          <div className="card-header">
            <h3 className="card-title-2">Achievements</h3>
            <span className="view-all">View All</span>
          </div>
          {loading ? (
            <Loader style={{ height: "200px" }} />
          ) : achievementData.length === 0 ? (
            <p className="no-data">No achievements yet</p>
          ) : (
            (achievementData.length > 3
              ? achievementData.slice(1, 3)
              : achievementData
            ).map((g, i) => (
              <div key={i} className="goal-row">
                <div className="goal-info">
                  <h4>{g.type}</h4>
                  <span>{g.at}</span>
                </div>
                <span className="goal-value">{g.value}</span>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
