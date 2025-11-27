import { useNavigate } from "react-router-dom";
import API from "../utils/api";
import { toast } from "sonner";

export const userType = (user) => {
  if (!user) return "noUser";
  if (user && user?.varified !== true) return "notVerified";
  if (user && user?.varified) return "verified";
};

// export const aiPrompt = ({
//   age,
//   height,
//   weight,
//   gender,
//   goal,
//   activityLevel,
// }) => {
//   return `
// Generate a highly structured, clean, and formatted daily diet plan.

// User Info:
// - Age: ${age}
// - Height: ${height} cm
// - Weight: ${weight} kg
// - Gender: ${gender}
// - Goal: ${goal}
// - Activity Level: ${activityLevel}

// ### IMPORTANT — REQUIRED OUTPUT FORMAT  
// Follow this exact structure for every meal:

// Meal Name (e.g., Breakfast)

// Food Name (portion size) — Type — Calories  
// Food Name (portion size) — Type — Calories  
// Food Name (portion size) — Type — Calories  
// ...  
// total : XXX calories

// ### Snack Rules:
// - Provide 2 snack sections:
//   - Snack 1 (Mid-morning)
//   - Snack 2 (Afternoon)
// - Use the same format:  
//   Food — Snack — Calories  
//   total : XXX calories

// ### Final Requirement:
// At the end, provide:
// "Total Daily Calories: XXXX"

// ### Example Format (DO NOT COPY FOODS, only copy the structure):
// Breakfast
// Oatmeal (1 cup dry) — Breakfast — 300  
// Protein Powder (1 scoop) — Breakfast — 120  
// Almonds (1/4 cup) — Breakfast — 200  
// Banana (1 medium) — Breakfast — 100  
// total :720 calories

// Lunch
// Grilled Chicken Breast (6 oz) — Lunch — 270  
// Brown Rice (1 cup cooked) — Lunch — 220  
// Steamed Broccoli (1.5 cups) — Lunch — 80  
// Olive Oil (1 tbsp) — Lunch — 130  
// total :700 calories

// Dinner
// Salmon (6 oz) — Dinner — 350  
// Sweet Potato (1 large baked) — Dinner — 250  
// Green Beans (1.5 cups) — Dinner — 70  
// Olive Oil (1 tbsp) — Dinner — 130  
// total :800 calories

// Snack 1 (Mid-morning)
// Greek Yogurt (1 cup) — Snack — 120  
// Mixed Berries (1 cup) — Snack — 80  
// Walnuts (1/4 cup) — Snack — 150  
// total :350 calories

// Snack 2 (Afternoon)
// Apple (1 medium) — Snack — 100  
// Peanut Butter (2 tbsp) — Snack — 200  
// Cottage Cheese (1/2 cup) — Snack — 65  
// total :365 calories

// ### Now generate the full plan using the user’s information and the required structure.
// `;
// };

export const aiPrompt = ({
  age,
  height,
  weight,
  gender,
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
