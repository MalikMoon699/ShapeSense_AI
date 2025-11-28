import React, { useEffect, useState } from "react";
import API from "../utils/api";
import { fetchAchievements } from "../services/Helpers";
import Loader from "../components/Loader";

const Achievements = () => {
  const [loading, setLoading] = useState(false);
  const [achievements, setAchievements] = useState([]);

  useEffect(() => {
    fetchAchievements(setLoading, setAchievements);
  }, []);

  const handleToggleAchievement = async (exercise) => {
    try {
      await API.delete("/achievement/remove-achievement", {
        data: { achievement: exercise },
      });

      fetchAchievements(setLoading, setAchievements);
    } catch (error) {
      console.error("Error toggling achievement:", error);
    }
  };

  return (
    <div className="schedule-container">
      <div className="schedule-header">
        <h3 className="schedule-header-title">Achievements</h3>
        <p className="schedule-header-cal">
          <strong>You Achieved:</strong> {achievements?.length || 0}{" "}
          Achievements
        </p>
      </div>

      {loading ? (
        <Loader size="70" style={{ height: "70vh" }} />
      ) : achievements.length > 0 ? (
        <div className="schedule-plan-card">
          {achievements.map((achievement, index) => (
            <div
              key={index}
              onClick={() => handleToggleAchievement(achievement)}
              className="workout-exercise-item active"
              style={{ marginBottom: "10px", cursor: "pointer" }}
            >
              {achievement}
            </div>
          ))}
        </div>
      ) : (
        <div
          className="schedule-section"
          style={{ textAlign: "center", marginTop: "100px" }}
        >
          No Achievements Found.
        </div>
      )}
    </div>
  );
};

export default Achievements;
