import React, { useState } from "react";
import "../assets/style/userDetails.css";
import AddUserDetailsLeftSide from "../components/AddUserDetailsLeftSide";
import AddUserDetailsRightSide from "../components/AddUserDetailsRightSide";
import { useAuth } from "../context/AuthContext";
import Loader from "../components/Loader";

const UserDetails = () => {
  const { currentUser } = useAuth();
  const [userData, setUserData] = useState({
    profileImg: currentUser?.profileImg || "",
    name: currentUser?.name || "",
    email: currentUser?.email || "",
    age: currentUser?.age || "",
    height: currentUser?.height || "",
    weight: currentUser?.weight || "",
    gender: currentUser?.gender || "",
    goal: currentUser?.goal || "",
    activityLevel: currentUser?.activityLevel || "",
    varified: true,
  });
  const [imagePreview, setImagePreview] = useState(userData.profileImg || "");
  const [dietGenrateLoading, setDietGenrateLoading] = useState(false);

  if (dietGenrateLoading)
    return (
      <div className="diet-generating-container">
        <div className="diet-generating-inner-container">
          <Loader />
          <div className="loader-text">
            <p className="title">
              AI is generating your personalized diet plan...
            </p>
            <p className="subtitle">This may take a few seconds. Sit tight!</p>
          </div>
        </div>
      </div>
    );

  return (
    <div className="user-details-container">
      <AddUserDetailsLeftSide
        userId={currentUser?.id}
        userData={userData}
        setUserData={setUserData}
        imagePreview={imagePreview}
        setImagePreview={setImagePreview}
        setDietGenrateLoading={setDietGenrateLoading}
      />
      <AddUserDetailsRightSide
        userData={userData}
        imagePreview={imagePreview}
      />
    </div>
  );
};

export default UserDetails;
