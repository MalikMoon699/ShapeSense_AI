// src/routes/workout.routes.js
import express from "express";
import {
  createWorkout,
  getWorkout,
  updateWorkout,
  deleteWorkout,
} from "../controllers/workout.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/create-workout", verifyToken, createWorkout);
router.get("/get-workout", verifyToken, getWorkout);
router.put("/update-workout/:id", verifyToken, updateWorkout);
router.delete("/delete-workout/:id", verifyToken, deleteWorkout);

export default router;
