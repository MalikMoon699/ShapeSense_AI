import express from "express";
import { question } from "../controllers/chat.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/question", verifyToken, question);

export default router;
