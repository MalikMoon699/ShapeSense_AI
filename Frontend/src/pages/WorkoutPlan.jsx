import React, { useEffect, useState } from "react";
import API from "../utils/api";
import "../assets/style/WorkoutPlan.css";
import Loader from "../components/Loader";
import {
  buttonAvalibale,
  fetchAchievements,
  fetchWorkout,
  workoutAiPrompt,
} from "../services/Helpers";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";
import { parseWorkoutPlan } from "../components/FormatResponse";
import { ChevronDown, ChevronUp } from "lucide-react";

const WorkoutPlan = () => {
  const { currentUser } = useAuth();
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [genrateLoading, setGenrateLoading] = useState(false);
  const [expandedDays, setExpandedDays] = useState({});
  const [expandedSections, setExpandedSections] = useState({});
  const [achievements, setAchievements] = useState([]);

  useEffect(() => {
    fetchWorkout(setLoading, setWorkouts);
    fetchAchievements(setLoading, setAchievements);
  }, []);

  useEffect(() => {
    if (workouts.length > 0) {
      const initialDays = {};
      const initialSections = {};

      workouts.forEach((workoutPlan) => {
        const sections = parseWorkoutPlan(workoutPlan.aiWorkout);
        Object.keys(sections).forEach((day) => {
          initialDays[day] = true;
          initialSections[day] = {};
          Object.keys(sections[day]).forEach((section) => {
            initialSections[day][section] = true;
          });
        });
      });

      setExpandedDays(initialDays);
      setExpandedSections(initialSections);
    }
  }, [workouts]);

  const dayProgressBar = (day, sections) => {
    let total = 0;
    let done = 0;

    Object.keys(sections[day]).forEach((section) => {
      const items = Array.isArray(sections[day][section])
        ? sections[day][section]
        : [sections[day][section]];

      total += items.length;
      done += items.filter((ex) =>
        achievements.includes(`${day}|${ex}`)
      ).length;
    });

    const percent = total === 0 ? 0 : (done / total) * 100;
    return percent + "%";
  };

  const sectionProgressBar = (day, section, items) => {
    const total = items.length;
    const done = items.filter((ex) =>
      achievements.includes(`${day}|${ex}`)
    ).length;

    const percent = total === 0 ? 0 : (done / total) * 100;
    return percent + "%";
  };

  const toggleDay = (day) => {
    setExpandedDays((prev) => ({
      ...prev,
      [day]: !prev[day],
    }));
  };

  const toggleSection = (day, section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [section]: !prev[day]?.[section],
      },
    }));
  };

  const aiData = {
    age: currentUser?.age,
    height: currentUser?.height,
    weight: currentUser?.weight,
    gender: currentUser?.gender,
    goal: currentUser?.goal,
    activityLevel: currentUser?.activityLevel,
  };

  // const handleGenrateWorkout = async () => {
  //   setGenrateLoading(true);
  //   try {
  //     await API.post("/workout/create-workout", {
  //       data: { prompt: workoutAiPrompt(aiData) },
  //     });
  //     fetchWorkout(setLoading, setWorkouts);
  //     toast.success("AI generated today's workout plan!");
  //   } catch (error) {
  //     console.error("Error generating today's workout plan:", error);
  //     toast.error("Failed to generate today's workout plan");
  //   } finally {
  //     setGenrateLoading(false);
  //   }
  // };

  const handleGenrateWorkout = async () => {
    setGenrateLoading(true);

    try {
      await API.delete("/achievement/clear");
      setAchievements([]);
      await API.post("/workout/create-workout", {
        data: { prompt: workoutAiPrompt(aiData) },
      });

      fetchWorkout(setLoading, setWorkouts);
      toast.success("AI generated today's workout plan!");
    } catch (error) {
      console.error("Error generating today's workout plan:", error);
      toast.error("Failed to generate today's workout plan");
    } finally {
      setGenrateLoading(false);
    }
  };

  const handleToggleAchievement = async (day, exercise) => {
    const key = `${day}|${exercise}`;
    const isAchieved = achievements.includes(key);

    try {
      if (isAchieved) {
        await API.delete("/achievement/remove-achievement", {
          data: { achievement: key },
        });
        setAchievements((prev) => prev.filter((a) => a !== key));
      } else {
        await API.post("/achievement/add-achievement", {
          achievement: key,
        });
        setAchievements((prev) => [...prev, key]);
      }
    } catch (error) {
      console.error("Error toggling achievement:", error);
    }
  };

  const buttonAllow = buttonAvalibale(workouts);

  return (
    <div className="schedule-container">
      <div className="schedule-header">
        <h3 className="schedule-header-title">Workout Plans</h3>
        {buttonAllow && !loading && (
          <button
            disabled={loading || genrateLoading}
            onClick={handleGenrateWorkout}
            className="workout-plans-genrate-btn"
          >
            {genrateLoading ? (
              <Loader size="10" style={{ height: "15px", width: "164px" }} />
            ) : (
              "Generate Workout Plan"
            )}
          </button>
        )}
      </div>

      {loading ? (
        <Loader size="10" style={{ height: "10vh" }} />
      ) : workouts.length > 0 ? (
        workouts.map((workoutPlan, index) => {
          const sections = parseWorkoutPlan(workoutPlan.aiWorkout);

          return (
            <div key={index} className="workout-plan-container">
              {Object.keys(sections).map((day, idx) => {
                const isDayExpanded = expandedDays[day] ?? true;

                return (
                  <div key={idx} className="workout-day-card">
                    <span
                      style={{ width: dayProgressBar(day, sections) }}
                      className="progressbar"
                    ></span>
                    <div
                      className="workout-day-card-header"
                      onClick={() => toggleDay(day)}
                    >
                      <h2 className="workout-day-title">{day}</h2>
                      <span className="workout-day-header-arrow">
                        {isDayExpanded ? <ChevronUp /> : <ChevronDown />}
                      </span>
                    </div>

                    {isDayExpanded &&
                      Object.keys(sections[day]).map((section, sidx) => {
                        const items = Array.isArray(sections[day][section])
                          ? sections[day][section]
                          : [sections[day][section]];

                        const isSectionExpanded =
                          expandedSections[day]?.[section] ?? true;

                        return (
                          <div key={sidx} className="workout-section">
                            <span
                              style={{
                                width: sectionProgressBar(day, section, items),
                              }}
                              className="progressbar"
                            ></span>
                            <div
                              className="workout-day-card-header"
                              onClick={() => toggleSection(day, section)}
                            >
                              <h3 className="workout-section-title">
                                {section}
                              </h3>
                              <span className="workout-day-header-arrow">
                                {isSectionExpanded ? (
                                  <ChevronUp />
                                ) : (
                                  <ChevronDown />
                                )}
                              </span>
                            </div>

                            {isSectionExpanded && (
                              <div className="workout-exercise-list">
                                {items.map((exercise, eidx) => {
                                  const isAchieved = achievements.includes(
                                    `${day}|${exercise}`
                                  );

                                  return (
                                    <div
                                      key={eidx}
                                      onClick={() =>
                                        handleToggleAchievement(day, exercise)
                                      }
                                      className={`workout-exercise-item ${
                                        isAchieved ? "active" : ""
                                      }`}
                                    >
                                      {exercise}
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        );
                      })}
                  </div>
                );
              })}
            </div>
          );
        })
      ) : (
        <p
          className="workout-section"
          style={{ textAlign: "center", marginTop: "70px" }}
        >
          No workout generated yet.
        </p>
      )}
    </div>
  );
};

export default WorkoutPlan;
