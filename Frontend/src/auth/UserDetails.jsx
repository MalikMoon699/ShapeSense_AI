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


  return (
    <div className="user-details-container">
      <AddUserDetailsLeftSide
        userId={currentUser?.id}
        userData={userData}
        setUserData={setUserData}
        imagePreview={imagePreview}
        setImagePreview={setImagePreview}
      />
      <AddUserDetailsRightSide
        userData={userData}
        imagePreview={imagePreview}
      />
    </div>
  );
};

export default UserDetails;
