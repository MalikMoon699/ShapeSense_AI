import React from "react";
import { Copy } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { materialDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { toast } from "sonner";

const handleCopy = (text) => {
  navigator.clipboard.writeText(text);
  toast.success("Code Copied!");
};

export const FormatResponse = ({ text }) => {
  return (
    <div
      style={{
        padding: "0px 10px",
        borderRadius: "10px",
        lineHeight: "1.6",
      }}
    >
      <ReactMarkdown
        components={{
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || "");
            return !inline && match ? (
              <>
                <div className="code-header">
                  <strong>Code</strong>
                  <span onClick={() => handleCopy(String(children))}>
                    <Copy size={15} />
                    Copy
                  </span>
                </div>
                <SyntaxHighlighter
                  style={materialDark}
                  language={match[1]}
                  PreTag="div"
                  {...props}
                >
                  {String(children).replace(/\n$/, "")}
                </SyntaxHighlighter>
              </>
            ) : (
              <code {...props}>{children}</code>
            );
          },
          h1: ({ children }) => (
            <h1 style={{ fontSize: "1.8em", margin: "10px 0" }}>{children}</h1>
          ),
          h2: ({ children }) => (
            <h2 style={{ fontSize: "1.5em", margin: "10px 0" }}>{children}</h2>
          ),
          h3: ({ children }) => (
            <h3 style={{ fontSize: "1.3em", margin: "8px 0" }}>{children}</h3>
          ),
          li: ({ children }) => (
            <li style={{ marginBottom: "6px" }}>{children}</li>
          ),
        }}
      >
        {text}
      </ReactMarkdown>
    </div>
  );
};

export const parseDietPlan = (planText) => {
  const sections = {};
  const lines = planText.split(
    /\n|(?=Breakfast|Snack 1|Snack 2|Lunch|Dinner)/g
  );

  let currentSection = "";

  lines.forEach((line) => {
    line = line.trim();
    if (!line) return;

    const calorieMatch = line.match(/Total Daily Calories:\s*(\d+)/i);
    if (calorieMatch) {
      return;
    }

    if (line.startsWith("At the end")) {
      return;
    }

    if (
      line.startsWith("Breakfast") ||
      line.startsWith("Snack 1") ||
      line.startsWith("Snack 2") ||
      line.startsWith("Lunch") ||
      line.startsWith("Dinner")
    ) {
      currentSection = line;
      sections[currentSection] = [];
    } else if (currentSection) {
      sections[currentSection].push(line);
    }
  });

  return sections;
};

export const getTotalCalories = (text) => {
  const match = text.match(/Total Daily Calories:\s*(\d+)/i);
  return match ? match[1] : null;
};

export const parseWorkoutPlan = (planText) => {
  const days = planText.split(
    /(?=Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)/
  );
  const workoutPlan = {};

  days.forEach((dayText) => {
    dayText = dayText.trim();
    if (!dayText) return;

    const dayMatch = dayText.match(
      /^(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)/
    );
    if (!dayMatch) return;

    const day = dayMatch[0];
    workoutPlan[day] = {};

    const subsectionRegex =
      /(Warm-up|Main Workout|Cool Down|Total Estimated Calories):?/g;
    const parts = dayText
      .split(subsectionRegex)
      .map((p) => p.trim())
      .filter(Boolean);

    for (let i = 1; i < parts.length; i += 2) {
      const title = parts[i];
      const content = parts[i + 1] || "";

      const items = content
        .split(/•|\n|-/)
        .map((item) => item.trim())
        .filter((item) => item.length > 0);

      workoutPlan[day][title] = items;
    }
  });

  return workoutPlan;
};

export const formatDashBoardWorkouts = (workouts) => {
  const goals = [];

  workouts.forEach((workout) => {
    const lines = workout.aiWorkout.split("\n").filter(Boolean);
    let day = "";
    let section = "";

    lines.forEach((line) => {
      if (
        [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ].includes(line)
      ) {
        day = line;
      } else if (!line.includes("—")) {
        section = line;
      } else {
        goals.push({
          at: `${day} | ${section}`,
          value: line,
          type: "Workout",
        });
      }
    });
  });

  return goals;
};

export const formatDashBoardAchievements = (achievements) => {
  return achievements.map((ach) => {
    const [day, exercise] = ach.split("|");
    return {
      at: `${day} | Completed`,
      value: exercise,
      type: "Achievement",
    };
  });
};

export const formatDashBoardPlans = (plans) => {
  return plans.flatMap((plan) => {
    const lines = plan.data?.aiPlan?.split("\n").filter(Boolean) || [];
    return lines.map((line) => ({
      at: new Date(plan.createdAt).toDateString(),
      value: line,
      type: plan.type.charAt(0).toUpperCase() + plan.type.slice(1),
    }));
  });
};
