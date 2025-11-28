// /src/routes/achievement.routes.js
import express from "express";
import {
  createAchievement,
  deleteAchievement,
  getAchievements,
} from "../controllers/achievement.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/get-achievements", verifyToken, getAchievements);
router.post("/add-achievement", verifyToken, createAchievement);
router.delete("/remove-achievement", verifyToken, deleteAchievement);

export default router;
