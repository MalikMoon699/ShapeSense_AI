// src/controllers/gemini.controller.js
import { GoogleGenerativeAI } from "@google/generative-ai";
import {GEMINI_API} from "../config/env.js"

const genAI = new GoogleGenerativeAI(GEMINI_API);

export const generatePlan = async (prompt) => {
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const result = await model.generateContent(prompt);
  return result.response.text();
};
