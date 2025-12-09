import express from "express";
import {
  generatePasskeyRegistration,
  verifyPasskeyRegistration,
  generatePasskeyLogin,
  verifyPasskeyLogin,
} from "../controllers/passkey.controller.js";

import { verifyToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/register-options", verifyToken, generatePasskeyRegistration);
router.post("/register-verify", verifyToken, verifyPasskeyRegistration);
router.get("/login-options", generatePasskeyLogin);
router.post("/login-verify", verifyPasskeyLogin);

export default router;
