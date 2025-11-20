import { useNavigate } from "react-router-dom";

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
  goal,
  activityLevel,
}) => {
  return `
Generate a personalized daily diet plan.

User Info:
- Age: ${age}
- Height: ${height} cm
- Weight: ${weight} kg
- Gender: ${gender}
- Goal: ${goal}
- Activity Level: ${activityLevel}

Requirements:
1. Calculate daily calorie target.
2. Provide a full-day food plan with calories:
   - Breakfast
   - Lunch
   - Dinner
   - Snacks/Other
3. Each meal must include:
   - Foods
   - Portion size
   - Calories
4. Provide total calories at the end.
5. Make it simple & practical.
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
