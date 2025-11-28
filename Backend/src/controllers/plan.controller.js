// src/controllers/plan.controller.js
import Plan from "../models/plan.model.js";
import { generatePlan } from "./gemini.controller.js";

export const createPlan = async (req, res) => {
  try {
    const { type, data } = req.body;
    const userId = req.user.id;

    if (!type || !data) {
      return res.status(400).json({ message: "Type and data are required" });
    }
    await Plan.deleteMany({ userId });
    const aiGeneratedPlan = await generatePlan(data.prompt || "");
    const plan = new Plan({
      userId,
      type,
      data: { ...data, aiPlan: aiGeneratedPlan },
    });

    await plan.save();

    res.status(201).json({
      message: "Previous plans removed. New plan created successfully.",
      plan,
    });
  } catch (error) {
    console.error("Error creating plan:", error);
    res.status(500).json({ message: "Failed to create plan" });
  }
};

export const getPlans = async (req, res) => {
  try {
    const userId = req.user.id;
    const plans = await Plan.find({ userId });
    res.status(200).json({ plans });
  } catch (error) {
    console.error("Error fetching plans:", error);
    res.status(500).json({ message: "Failed to fetch plans" });
  }
};

export const updatePlan = async (req, res) => {
  try {
    const { id } = req.params;
    const { data, type } = req.body;

    const plan = await Plan.findById(id);
    if (!plan) return res.status(404).json({ message: "Plan not found" });

    if (plan.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (type) plan.type = type;
    if (data) plan.data = data;

    await plan.save();
    res.status(200).json({ message: "Plan updated successfully", plan });
  } catch (error) {
    console.error("Error updating plan:", error);
    res.status(500).json({ message: "Failed to update plan" });
  }
};

export const deletePlan = async (req, res) => {
  try {
    const { id } = req.params;

    const plan = await Plan.findById(id);
    if (!plan) return res.status(404).json({ message: "Plan not found" });

    if (plan.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await plan.deleteOne();
    res.status(200).json({ message: "Plan deleted successfully" });
  } catch (error) {
    console.error("Error deleting plan:", error);
    res.status(500).json({ message: "Failed to delete plan" });
  }
};