import { generatePlan } from "./gemini.controller.js";

export const question = async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ message: "Prompt is required" });

    const aiAnswer = await generatePlan(prompt);

    res.status(200).json({
      success: true,
      data: aiAnswer,
    });
  } catch (error) {
    console.error("Error in AI answer:", error);
    res.status(500).json({ error: error.message });
  }
};
