import React, { useEffect, useState } from "react";
import API from "../utils/api";
import { toast } from "sonner";
import "../assets/style/DashBoard.css";

const DashBoard = () => {
  const [diet, setDiet] = useState(null);

  useEffect(() => {
    getPlans();
  }, []);

  const getPlans = async () => {
    try {
      const res = await API.get("/plan/get-plans");
      setDiet(res?.data?.plans);
      console.log("res--->", res);
    } catch (error) {
      console.error("Error fetch plans:", error);
      toast.error("Failed to fetch plans");
    }
  };

  return (
    <div className="Dashboard-container">
      {diet && diet.length > 0 ? (
        diet.map((plan) => (
          <div key={plan._id} className="Dashboard-plan-card">
            <h3>Type: {plan.type}</h3>
            <p>AI Plan: {plan.data.aiPlan}</p>
            <p>Created At: {new Date(plan.createdAt).toLocaleString()}</p>
          </div>
        ))
      ) : (
        <p>No plans available</p>
      )}
    </div>
  );
};

export default DashBoard;
