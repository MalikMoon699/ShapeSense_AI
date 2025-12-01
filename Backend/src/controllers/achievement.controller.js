import Achievement from "../models/achievement.model.js";

export const getAchievements = async (req, res) => {
  try {
    const achievements = await Achievement.find({ userId: req.user.id });
    res
      .status(200)
      .json({ achievements: achievements.map((a) => a.achievement) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createAchievement = async (req, res) => {
  const userId = req.user.id;
  const { achievement } = req.body;

  try {
    const exists = await Achievement.findOne({ userId, achievement });
    if (exists) return res.status(400).json({ message: "Already exists" });

    const newAch = await Achievement.create({
      userId,
      achievement,
      date: new Date().toDateString(),
    });
    res.status(201).json({ success: true, achievement: newAch });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteAchievement = async (req, res) => {
  const userId = req.user.id;
  const { achievement } = req.body;

  try {
    await Achievement.findOneAndDelete({ userId, achievement });
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const clearAchievements = async (req, res) => {
  try {
    await Achievement.deleteMany({ userId: req.user.id });
    res.status(200).json({ success: true, message: "Achievements cleared" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
