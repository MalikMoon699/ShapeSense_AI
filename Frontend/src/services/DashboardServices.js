export const PeriodZone = () => {
  const currentTime = new Date();
  const hours = currentTime.getHours();
  if (hours >= 5 && hours < 12) {
    return "Morning";
  } else if (hours >= 12 && hours < 17) {
    return "Afternoon";
  } else if (hours >= 17 && hours < 21) {
    return "Evening";
  } else {
    return "Night";
  }
};

export const activityData = [
  { day: "Mon", value: 300 },
  { day: "Tue", value: 450 },
  { day: "Wed", value: 200 },
  { day: "Thu", value: 600 },
  { day: "Fri", value: 800 },
  { day: "Sat", value: 750 },
  { day: "Sun", value: 900 },
];

export const monthlyProgressData = () => {
  return 80;
};
export const goalsData = [
  {
    at: "Saturday, April 14 | 08:00AM",
    value: "04 Rounds",
    type: "Running on Track",
  },
  {
    at: "Sunday, April 15 | 08:00AM",
    value: "50 Pieces",
    type: "Push Up",
  },
];

export const myScheduleData = [
  {
    at: "Monday | 08:00AM",
    value: "20 Pieces",
    type: "Stretch",
  },
  {
    at: "Tuesday | 08:00AM",
    value: "10 Rounds",
    type: "Back Stretch",
  },
];
