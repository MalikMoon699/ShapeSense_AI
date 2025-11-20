// src/models/plan.model.js
import mongoose from "mongoose";

const planSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: { type: String, required: true },
    data: { type: Object, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Plan", planSchema);
