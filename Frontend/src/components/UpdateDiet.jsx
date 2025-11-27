import { X } from "lucide-react";
import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import "../assets/style/UpdateDiet.css";
import Loader from "../components/Loader";
import API from "../utils/api";
import { aiPrompt } from "../services/Helpers";
import { toast } from "sonner";

const UpdateDiet = ({ onClose, ReFetch }) => {
  const { currentUser, refresh } = useAuth();
  const [dietGenrateLoading, setDietGenrateLoading] = useState(null);

  const handleAiDiet = async () => {
    setDietGenrateLoading("updateDiet");
    try {
      await API.post("/plan/create-plan", {
        type: "diet",
        data: {
          prompt: aiPrompt(aiData),
        },
      });

      await API.put(`/auth/update-plan-date/${currentUser?._id}`, {
        lastPlanUpdateAt: new Date().toDateString(),
      });

      toast.success("AI generated new plan!");
      refresh();
      ReFetch();
      onClose();
    } catch (error) {
      console.error("Error Ai generating plans:", error);
      toast.error("Failed to Ai plans generating");
    } finally {
      setDietGenrateLoading(null);
    }
  };

  const handleAiDietNotChange = async () => {
    setDietGenrateLoading("noChange");
    try {
      await API.put(`/auth/update-plan-date/${currentUser?._id}`, {
        lastPlanUpdateAt: new Date().toDateString(),
      });

      toast.success("Plan kept same for today");
      refresh();
      ReFetch();
      onClose();
    } catch (error) {
      console.error("Error updating date:", error);
      toast.error("Failed to update date");
    } finally {
      setDietGenrateLoading(null);
    }
  };

  const aiData = {
    age: currentUser?.age,
    height: currentUser?.height,
    weight: currentUser?.weight,
    gender: currentUser?.gender,
    goal: currentUser?.goal,
    activityLevel: currentUser?.activityLevel,
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="modal-title">Welcome Back</h2>
        </div>

        <div className="update-diet-body">
          <h3 className="update-diet-question">
            Do you want a new diet plan for today?
          </h3>

          <div className="update-diet-actions">
            <button
              className="update-diet-btn update-diet-btn-secondary"
              disabled={dietGenrateLoading === "noChange"}
              onClick={handleAiDietNotChange}
            >
              {dietGenrateLoading === "noChange" ? (
                <Loader size="16" style={{ width: "84px" }} />
              ) : (
                "No Change"
              )}
            </button>

            <button
              className="update-diet-btn update-diet-btn-primary"
              onClick={handleAiDiet}
              disabled={dietGenrateLoading === "updateDiet"}
            >
              {dietGenrateLoading === "updateDiet" ? (
                <Loader size="16" color="black" style={{ width: "84px" }} />
              ) : (
                " Update Diet"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateDiet;
