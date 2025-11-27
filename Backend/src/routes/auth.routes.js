// src/routes/auth.routes.js
import express from "express";
import {
  signUp,
  login,
  getUserData,
  updateUserData,
  uploadProfileImage,
  updatePlanDate,
} from "../controllers/auth.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/register", signUp);
router.post("/login", login);
router.get("/user", verifyToken, getUserData);
router.put("/updateUser/:id", verifyToken, uploadProfileImage, updateUserData);
router.put("/update-plan-date/:id", verifyToken, updatePlanDate);

export default router;
