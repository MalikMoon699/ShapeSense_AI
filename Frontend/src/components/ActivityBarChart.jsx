import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  ResponsiveContainer,
  Tooltip,
  Cell,
} from "recharts";

const prepareChartData = (achievementData) => {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const dayShort = {
    Monday: "Mon",
    Tuesday: "Tue",
    Wednesday: "Wed",
    Thursday: "Thu",
    Friday: "Fri",
    Saturday: "Sat",
    Sunday: "Sun",
  };

  const dataMap = {};
  days.forEach((d) => (dataMap[d] = 0));

  achievementData.forEach((item) => {
    let day = "";

    if (typeof item === "string") {
      day = item.split("|")[0].trim();
    } else {
      day = item.at.split("|")[0].trim();
    }

    const short = dayShort[day];
    if (short) dataMap[short]++;
  });

  return days.map((d) => ({ day: d, value: dataMap[d] }));
};

const getDailyStats = (totalWorkouts, achievements) => {
  const dayMap = {
    Monday: "Mon",
    Tuesday: "Tue",
    Wednesday: "Wed",
    Thursday: "Thu",
    Friday: "Fri",
    Saturday: "Sat",
    Sunday: "Sun",
  };

  const stats = {
    Mon: { total: 0, completed: 0 },
    Tue: { total: 0, completed: 0 },
    Wed: { total: 0, completed: 0 },
    Thu: { total: 0, completed: 0 },
    Fri: { total: 0, completed: 0 },
    Sat: { total: 0, completed: 0 },
    Sun: { total: 0, completed: 0 },
  };

  totalWorkouts.forEach((item) => {
    const day = item.at.split("|")[0].trim();
    const short = dayMap[day];
    if (short) stats[short].total++;
  });

  achievements.forEach((item) => {
    const day = (
      typeof item === "string" ? item.split("|")[0] : item.at.split("|")[0]
    ).trim();
    const short = dayMap[day];
    if (short) stats[short].completed++;
  });

  Object.keys(stats).forEach((day) => {
    stats[day].pending = stats[day].total - stats[day].completed;
  });

  return stats;
};

const CustomTooltip = ({ active, payload, dailyStats }) => {
  if (active && payload && payload.length) {
    const day = payload[0].payload.day;
    const stats = dailyStats[day];

    return (
      <div
        style={{
          background: "var(--backGroundColor)",
          padding: "10px 14px",
          borderRadius: 10,
          color: "var(--textColor)",
          border: "1px solid var(--borderColor)",
          width: "150px",
        }}
      >
        <strong style={{ color: "var(--primaryColor)" }}>{day}</strong>
        <p>
          <strong style={{ color: "var(--primaryColorDark)" }}>Total:</strong>{" "}
          {stats.total}
        </p>
        <p>
          <strong style={{ color: "var(--primaryColorDark)" }}>Pending:</strong>{" "}
          {stats.pending}
        </p>
        <p>
          <strong style={{ color: "var(--primaryColorDark)" }}>
            Completed:
          </strong>{" "}
          {stats.completed}
        </p>
      </div>
    );
  }
  return null;
};

const ActivityChart = ({ achievements, workoutData }) => {
  const [activeIndex, setActiveIndex] = useState(null);

  const chartData = prepareChartData(achievements);
  const dailyStats = getDailyStats(workoutData, achievements);

  return (
    <div style={{paddingTop:"12px"}}>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={chartData}>
          <XAxis
            dataKey="day"
            tick={{ fill: "var(--textColor)" }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            content={<CustomTooltip dailyStats={dailyStats} />}
            cursor={{ fill: "transparent" }}
          />

          <Bar
            dataKey="value"
            radius={[20, 20, 20, 20]}
            barSize={30}
            fill="var(--primaryColorDark)"
            onMouseEnter={(_, index) => setActiveIndex(index)}
            onMouseLeave={() => setActiveIndex(null)}
          >
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={
                  index === activeIndex
                    ? "var(--primaryColor)"
                    : "var(--primaryColorDark)"
                }
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ActivityChart;
