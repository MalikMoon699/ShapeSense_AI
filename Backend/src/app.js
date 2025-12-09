import {
  PORT,
  NODE_ENV,
  DB_URI,
  JWT_SECRET,
  EMAIL_HOST,
  EMAIL_PORT,
  EMAIL_USER,
  EMAIL_PASS,
  ADMIN_EMAIL,
  GEMINI_API,
} from "./config/env.js";

import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import morgan from "morgan";
import authRoutes from "./routes/auth.routes.js";
import planRoutes from "./routes/plan.routes.js";
import workoutRoutes from "./routes/workout.routes.js";
import achievementRoutes from "./routes/achievement.routes.js";
import chatRoutes from "./routes/chat.routes.js";
import passkey from "./routes/passkey.routes.js";
import connectToDB from "./database/mongodb.js";

const app = express();
connectToDB();

app.use(cors());
app.use(morgan("dev"));

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/plan", planRoutes);
app.use("/api/workout", workoutRoutes);
app.use("/api/achievement", achievementRoutes);
app.use("/api/chatBot", chatRoutes);
app.use("/api/passkey", passkey);

app.get("/", (req, res) => {
  res.send(
    "Welcome to the Server API"
  );
});

app.listen(PORT, async () => {
  await connectToDB();
  console.log(`Server is running on http://localhost:${PORT}`);
});

export default app;
