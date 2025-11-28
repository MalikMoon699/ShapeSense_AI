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

export const workoutAiPrompt = ({
  age,
  height,
  weight,
  gender,
  goal,
  activityLevel,
}) => {
  return `
Generate a structured **weekly workout plan** for the user.

User Info:
- Age: ${age}
- Height: ${height} cm
- Weight: ${weight} kg
- Gender: ${gender}
- Goal: ${goal}
- Activity Level: ${activityLevel}

### IMPORTANT — REQUIRED OUTPUT FORMAT

1. Provide workouts for each day of the week (Monday → Sunday).
2. Divide each day into sections:
   - Warm-up
   - Main Workout (5–7 exercises)
   - Cool Down / Stretching
3. Use plain text format only, no markdown, no extra explanations, no disclaimers.

### Example Format:

Monday  
Warm-up  
Jumping Jacks — 2 mins  
Arm Circles — 1 min each  
Leg Swings — 30 seconds each leg  

Main Workout  
Bodyweight Squats — 3 sets × 20 reps  
Push-ups — 3 sets × As Many Reps As Possible (AMRAP)  
Walking Lunges — 3 sets × 10 reps per leg  
Plank — 3 sets × 30–60 seconds  
Dumbbell Rows — 3 sets × 12 reps per arm  
Glute Bridges — 3 sets × 15 reps  

Cool Down  
Quad Stretch — 1 min per leg  
Hamstring Stretch — 1 min per leg  
Tricep Stretch — 30 seconds per arm  

Total Estimated Calories Burned: 400–500 calories

Tuesday  
Warm-up  
...  

Continue this format for all days (Wednesday → Sunday).

### FINAL REQUIREMENT:
- Do not include any text like "Daily Workout Plan", "Notes", "Disclaimer", or explanations.
- Only output plain text for the workouts with sections and exercises as shown above.
`;
};

export const chatBotPrompt = ({
  currentUser,
  workoutPlans,
  achievements,
  schedule,
  userMessage,
}) => {
  return `
You are FitAI, a friendly personalized fitness assistant inside a mobile app.
You must answer based on the "USER DATA" below. Do not make up info.

USER DATA:
- Profile:
  • Age: ${currentUser?.age || "unknown"}
  • Gender: ${currentUser?.gender || "unknown"}
  • Height: ${currentUser?.height || "unknown"}
  • Weight: ${currentUser?.weight || "unknown"}
  • Goal: ${currentUser?.goal || "unknown"}
  • Activity Level: ${currentUser?.activityLevel || "unknown"}

- Workout Plans: ${JSON.stringify(workoutPlans)}
- Achievements: ${JSON.stringify(achievements)}
- Schedule: ${JSON.stringify(schedule)}

USER QUESTION: ${userMessage}

RESPONSE RULES:
1. Friendly, concise, and helpful.
2. Give advice based on actual data only.
3. Show progress using achievements + workouts.
4. Keep encouragement and actionable steps.
5. Use bullets for lists.
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

export const fetchPlans = async (setLoading, setPlans) => {
  try {
    setLoading(true);
    const res = await API.get("/plan/get-plans");
    setPlans(res?.data?.plans || []);
  } catch (error) {
    console.error("Error fetching plans:", error);
    toast.error("Failed to fetch plans");
  } finally {
    setLoading(false);
  }
};

export const fetchWorkout = async (setLoading, setWorkout) => {
  try {
    setLoading(true);
    const res = await API.get("/workout/get-workout");
    setWorkout(res?.data?.workouts || []);
  } catch (error) {
    console.error("Error fetching workout:", error);
    toast.error("Failed to fetch workout plans");
  } finally {
    setLoading(false);
  }
};

export const fetchAchievements = async (setLoading, setAchievements) => {
  try {
    setLoading(true);
    const res = await API.get("/achievement/get-achievements");
    setAchievements(res.data.achievements || []);
  } catch (error) {
    console.error("Error fetching achievements:", error);
  } finally {
    setLoading(false);
  }
};

export const buttonAvalibale = (workouts) => {
  let buttonAvailable = false;

  if (workouts.length === 0) {
    return (buttonAvailable = true);
  }

  const lastWorkoutDateStr = workouts[0]?.date;
  if (lastWorkoutDateStr) {
    const lastWorkoutDate = new Date(lastWorkoutDateStr);
    const today = new Date();

    const diffTime = today - lastWorkoutDate;
    const diffDays = diffTime / (1000 * 60 * 60 * 24);

    if (diffDays >= 8) {
      buttonAvailable = true;
    }
  }
  return buttonAvailable;
};
