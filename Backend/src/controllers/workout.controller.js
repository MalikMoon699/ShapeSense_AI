// src/controllers/workout.controller.js
import Workout from "../models/workout.model.js";
import { generatePlan } from "./gemini.controller.js";

export const createWorkout = async (req, res) => {
  try {
    const userId = req.user.id;
    const { data } = req.body;

    if (!data?.prompt) {
      return res.status(400).json({ message: "Prompt is required" });
    }

    const aiWorkout = await generatePlan(data.prompt);
    const todaysDate = new Date().toDateString();
    await Workout.deleteMany({ userId });
    const newWorkout = await Workout.create({
      userId,
      aiWorkout,
      date: todaysDate,
    });

    res.status(201).json({
      success: true,
      message: "Workout created successfully",
      workout: newWorkout,
    });
  } catch (error) {
    console.error("Error creating workout:", error);
    res.status(500).json({ error: error.message });
  }
};

export const getWorkout = async (req, res) => {
  try {
    const userId = req.user.id;
    const workouts = await Workout.find({ userId }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      workouts,
    });
  } catch (error) {
    console.error("Error fetching workouts:", error);
    res.status(500).json({ error: error.message });
  }
};

export const updateWorkout = async (req, res) => {
  try {
    const workoutId = req.params.id;

    const updatedWorkout = await Workout.findByIdAndUpdate(
      workoutId,
      req.body,
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Workout updated",
      workout: updatedWorkout,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteWorkout = async (req, res) => {
  try {
    const workoutId = req.params.id;

    await Workout.findByIdAndDelete(workoutId);

    res.status(200).json({
      success: true,
      message: "Workout deleted",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
