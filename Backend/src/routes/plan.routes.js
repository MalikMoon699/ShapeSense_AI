// src/routes/plan.routes.js
import express from "express";
import {
  createPlan,
  getPlans,
  updatePlan,
  deletePlan,
} from "../controllers/plan.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/create-plan", verifyToken, createPlan);
router.get("/get-plans", verifyToken, getPlans);
router.put("/update-plan/:id", verifyToken, updatePlan);
router.delete("delete-plan/:id", verifyToken, deletePlan);

export default router;
