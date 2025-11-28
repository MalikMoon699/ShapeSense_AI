import React, { useEffect, useState } from "react";
import { fetchPlans } from "../services/Helpers";
import { useAuth } from "../context/AuthContext";
import UpdateDiet from "../components/UpdateDiet";
import "../assets/style/Schedule.css";
import { getTotalCalories, parseDietPlan } from "../components/FormatResponse";
import Loader from "../components/Loader";

const Schedule = () => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [isUpdateDiet, setIsUpdateDiet] = useState(false);
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    fetchPlans(setLoading, setPlans);
  }, []);

  const updateAvailable =
    currentUser && currentUser?.lastPlanUpdateAt !== new Date().toDateString();

  useEffect(() => {
    if (currentUser && updateAvailable) setIsUpdateDiet(true);
  }, [currentUser, updateAvailable]);

  const totalCalories = getTotalCalories(plans[0]?.data?.aiPlan || "");

  return (
    <div className="schedule-container">
      <div className="schedule-header">
        <h3 className="schedule-header-title">Today's Schedule</h3>
        <p className="schedule-header-cal">
          <strong>Today Total Cal:</strong> {totalCalories || 0}
        </p>
      </div>
      {loading ? (
        <Loader size="70" style={{ height: "70vh" }} />
      ) : plans.length > 0 ? (
        plans.map((plan, index) => {
          const sections = parseDietPlan(plan.data?.aiPlan || "");

          return (
            <div key={index} className="schedule-plan-card">
              {Object.keys(sections).map((title, i) => (
                <div key={i} className="schedule-section">
                  <h2 className="schedule-section-title">{title}</h2>

                  <div className="schedule-food-list">
                    {sections[title].map((line, j) => (
                      <div key={j} className="schedule-food-item">
                        {line}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          );
        })
      ) : (
        <div
          className="schedule-section"
          style={{ textAlign: "center", marginTop: "100px" }}
        >
          Your Schedule Not Found.
        </div>
      )}
      {isUpdateDiet && (
        <UpdateDiet
          onClose={() => setIsUpdateDiet(false)}
          ReFetch={() => fetchPlans(setLoading, setPlans)}
        />
      )}
    </div>
  );
};

export default Schedule;
