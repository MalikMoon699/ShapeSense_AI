import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    profileImg: String,
    name: String,
    email: { type: String, unique: true },
    password: String,
    age: Number,
    height: Number,
    weight: Number,
    gender: String,
    goal: String,
    activityLevel: String,
    lastPlanUpdateAt: String,
    dietDay: { type: Number, default: 1 },
    varified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
