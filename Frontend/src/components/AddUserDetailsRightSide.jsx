import React from "react";
import { IMAGES } from "../services/Constants";

const AddUserDetailsRightSide = ({ userData, imagePreview }) => {
  return (
    <div className="right-side-container">
      <div className="user-card">
        <div className="profile-section">
          <img
            src={imagePreview || userData.profileImg || IMAGES.PlaceHolder}
            alt="Profile"
            className="profile-img"
          />
          <h2 className="user-name">{userData.name || "Full Name"}</h2>
          <p className="user-email">{userData.email || "Email Address"}</p>
        </div>

        <div className="user-details-section">
          <h3>Personal Info</h3>
          <ul className="user-details-list">
            <li>
              <span>Age:</span> {userData.age || "-"}
            </li>
            <li>
              <span>Height:</span>{" "}
              {userData.height ? `${userData.height} cm` : "-"}
            </li>
            <li>
              <span>Weight:</span>{" "}
              {userData.weight ? `${userData.weight} kg` : "-"}
            </li>
            <li>
              <span>Gender:</span> {userData.gender || "-"}
            </li>
          </ul>

          <h3>Goals & Activity</h3>
          <ul className="user-details-list">
            <li>
              <span>Goal:</span> {userData.goal || "-"}
            </li>
            <li>
              <span>Activity Level:</span> {userData.activityLevel || "-"}
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AddUserDetailsRightSide;
