import React, { useState } from "react";
import API from "../utils/api.js";
import { toast } from "sonner";
import { Camera, ChevronLeft, ChevronRight } from "lucide-react";
import Loader from "./Loader";
import { IMAGES } from "../services/Constants.js";
import { useAuth } from "../context/AuthContext.jsx";
import { aiPrompt } from "../services/Helpers.js";

const steps = ["Profile & Basic Info", "Physical Info", "Goals & Activity"];

const AddUserDetailsLeftSide = ({
  userId,
  userData,
  setUserData,
  imagePreview,
  setImagePreview,
  setDietGenrateLoading,
}) => {
  const { currentUser } = useAuth();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleChange = (field, value) => {
    setUserData((prev) => ({ ...prev, [field]: value }));
  };

  const validation = () => {
    if (!userData.name) {
      toast.error("Name is required");
      return false;
    }

    if (!userData.email) {
      toast.error("Email is required");
      return false;
    }

    if (!userData.age) {
      toast.error("Age is required");
      return false;
    }

    if (!userData.height) {
      toast.error("Height is required");
      return false;
    }

    if (!userData.weight) {
      toast.error("Weight is required");
      return false;
    }

    if (!userData.gender) {
      toast.error("Gender is required");
      return false;
    }

    if (!userData.goal) {
      toast.error("Goal is required");
      return false;
    }

    if (!userData.activityLevel) {
      toast.error("Activity Level is required");
      return false;
    }

    return true;
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    handleChange("profileImg", file);
    const previewURL = URL.createObjectURL(file);
    setImagePreview(previewURL);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isValid = validation();
    if (!isValid) return;
    setLoading(true);
    try {
      const formData = new FormData();

      Object.entries(userData).forEach(([key, value]) => {
        if (key !== "profileImg") {
          formData.append(key, value);
        }
      });

      if (userData.profileImg instanceof File) {
        formData.append("profileImg", userData.profileImg);
      }

      await API.put(`/auth/updateUser/${currentUser._id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Profile updated successfully!");
      handleAiDiet();
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const aiData = {
    age: userData?.age,
    height: userData?.height,
    weight: userData?.weight,
    gender: userData?.gender,
    dietDay: currentUser?.dietDay || 1,
    goal: userData?.goal,
    activityLevel: userData?.activityLevel,
  };

  const handleAiDiet = async () => {
    setDietGenrateLoading(true);
    try {
      await API.post("/plan/create-plan", {
        type: "diet",
        data: {
          prompt: aiPrompt(aiData),
        },
      });
      toast.success("Ai generated plans successfully!");
    } catch (error) {
      console.error("Error Ai generating plans:", error);
      toast.error("Failed to Ai plans generating");
    } finally {
      setDietGenrateLoading(false);
    }
  };

  const nextStepValidation = () => {
    if (step === 0) {
      if (!userData.name) return toast.error("Name is required");
      if (!userData.email) return toast.error("Email is required");
      return nextStep();
    }

    if (step === 1) {
      if (!userData.age) return toast.error("Age is required");
      if (!userData.height) return toast.error("Height is required");
      if (!userData.weight) return toast.error("Weight is required");
      if (!userData.gender) return toast.error("Gender is required");
      return nextStep();
    }

    if (step === 2) {
      if (!userData.goal) return toast.error("Goal is required");
      if (!userData.activityLevel)
        return toast.error("Activity Level is required");
      return nextStep();
    }

    return true;
  };

  const getProgress = () => {
    const totalSteps = 2;
    const progress = (step / totalSteps) * 100;
    return `${progress}%`;
  };

  const nextStep = () =>
    setStep((prev) => Math.min(prev + 1, steps.length - 1));

  const prevStep = () => setStep((prev) => Math.max(prev - 1, 0));

  return (
    <div className="left-side-container">
      <div className="left-side-header-container">
        <div className="step-indicator">
          <span className="active-step">{steps[step]}</span>
        </div>
        <div className="form-navigation">
          {step > 0 && (
            <button type="button" className="prev-btn" onClick={prevStep}>
              <span className="icon">
                <ChevronLeft />
              </span>
              Back
            </button>
          )}
          {step < steps.length - 1 && (
            <button
              type="button"
              className="next-btn"
              onClick={nextStepValidation}
            >
              Next
              <span className="icon">
                <ChevronRight />
              </span>
            </button>
          )}
        </div>
      </div>
      <form className="add-user-form" onSubmit={handleSubmit}>
        <div
          style={{ width: getProgress(), zIndex: 1 }}
          className="add-user-form-progress-bar"
        />
        <div
          className="add-user-form-progress-bar"
          style={{ background: "var(--cardSubTitleColor)" }}
        />
        {step === 0 && (
          <div className="form-step">
            <div className="image-upload-wrapper">
              <img
                src={imagePreview || IMAGES.PlaceHolder}
                alt="Profile"
                className="profile-preview"
              />
              <label className="image-upload-btn">
                <Camera />
                <input
                  type="file"
                  name="profileImg"
                  hidden
                  onChange={handleImageUpload}
                />
              </label>
            </div>
            <input
              type="text"
              placeholder="Full Name"
              value={userData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={userData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              required
            />
          </div>
        )}

        {step === 1 && (
          <div className="form-step">
            <input
              type="number"
              placeholder="Age"
              value={userData.age}
              onChange={(e) => handleChange("age", e.target.value)}
            />
            <input
              type="number"
              placeholder="Height (cm)"
              value={userData.height}
              onChange={(e) => handleChange("height", e.target.value)}
            />
            <input
              type="number"
              placeholder="Weight (kg)"
              value={userData.weight}
              onChange={(e) => handleChange("weight", e.target.value)}
            />
            <select
              value={userData.gender}
              onChange={(e) => handleChange("gender", e.target.value)}
            >
              <option value="" disabled>
                Select Gender
              </option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
        )}

        {step === 2 && (
          <div className="form-step">
            <input
              type="text"
              placeholder="Goal"
              value={userData.goal}
              onChange={(e) => handleChange("goal", e.target.value)}
            />
            <select
              value={userData.activityLevel}
              onChange={(e) => handleChange("activityLevel", e.target.value)}
            >
              <option value="" disabled>
                Activity Level
              </option>
              <option value="light">Light</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
        )}

        <div className="form-navigation-add-details">
          {step === steps.length - 1 && (
            <button
              type="submit"
              className="landing-page-cta"
              disabled={loading}
            >
              {loading ? (
                <Loader size="14" />
              ) : userId ? (
                "Update User"
              ) : (
                "Add Details"
              )}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default AddUserDetailsLeftSide;
