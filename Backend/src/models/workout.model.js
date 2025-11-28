// // src/models/workout.model.js

import mongoose from "mongoose";

const workoutSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    aiWorkout: { type: String, required: true },
    caloriesBurned: { type: Number, default: 0 },
    date: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Workout", workoutSchema);
