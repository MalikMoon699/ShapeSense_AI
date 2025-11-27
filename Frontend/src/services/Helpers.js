import { useNavigate } from "react-router-dom";
import API from "../utils/api";
import { toast } from "sonner";

export const userType = (user) => {
  if (!user) return "noUser";
  if (user && user?.varified !== true) return "notVerified";
  if (user && user?.varified) return "verified";
};

export const aiPrompt = ({
  age,
  height,
  weight,
  gender,
  dietDay,
  goal,
  activityLevel,
}) => {
  return `
Generate a daily diet plan STRICTLY in the format below.  
DO NOT add any explanations, greetings, assumptions, notes, UI text, or extra sentences.  
DO NOT start with text like "Here is your plan", "Okay", etc.  
ONLY output the meals EXACTLY in this format:

Meal Name  
Food Name (portion size) — Type — Calories  
Food Name (portion size) — Type — Calories  
...  
total : XXX calories

Snack 1 (Mid-morning)  
Food — Snack — Calories  
...  
total : XXX calories

Snack 2 (Afternoon)  
Food — Snack — Calories  
...  
total : XXX calories

At the end:  
Total Daily Calories: XXXX

### User Info:
Age: ${age}  
Height: ${height} cm  
Weight: ${weight} kg  
Gender: ${gender}  
dietDay: ${dietDay}  
Goal: ${goal}  
Activity Level: ${activityLevel}

### RULES (IMPORTANT):
- NO extra text besides the meals.
- NO descriptions.
- NO paragraphs.
- NO explanations.
- NO UI words like Dashboard, Schedule, Achievements, etc.
- ONLY the structured meal plan in the exact required format.

Now generate the meal plan following the exact structure above.
`;
};

export const useGoBack = () => {
  const navigate = useNavigate();
  return () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/");
    }
  };
};

export const fetchPlans = async (setPlans) => {
  try {
    const res = await API.get("/plan/get-plans");
    setPlans(res?.data?.plans || []);
  } catch (error) {
    console.error("Error fetching plans:", error);
    toast.error("Failed to fetch plans");
  }
};
