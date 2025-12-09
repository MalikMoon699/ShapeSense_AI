import React, { useState } from "react";
import "../assets/style/userDetails.css";
import AddUserDetailsLeftSide from "../components/AddUserDetailsLeftSide";
import AddUserDetailsRightSide from "../components/AddUserDetailsRightSide";
import { useAuth } from "../context/AuthContext";
import Loader from "../components/Loader";
import { startRegistration } from "@simplewebauthn/browser";
import API from "../utils/api";
import { toast } from "sonner";

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

  const addPasskey = async () => {
    const opts = await API.get("/passkey/register-options");

    try {
      const regResp = await startRegistration(opts.data);
      await API.post("/passkey/register-verify", regResp);
      toast.success("Passkey added!");
    } catch (err) {
      toast.error("Device not supported");
    }
  };

  return (
    <div className="user-details-container">
      <button onClick={addPasskey}>
        Add Passkey (Face / Finger / Passcode)
      </button>
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
