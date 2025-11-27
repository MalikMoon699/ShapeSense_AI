// src/controllers/auth.controller.js
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import dotenv from "dotenv";
import { JWT_SECRET } from "../config/env.js";
import multer from "multer";
import mailer from "../config/mailer.js";
import cloudinary from "../config/cloudinary.js";
import { Readable } from "stream";

const storage = multer.memoryStorage();
export const uploadProfileImage = multer({ storage }).single("profileImg");

const uploadFromBuffer = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "user_profiles" },
      (error, result) => {
        if (result) resolve(result);
        else reject(error);
      }
    );
    Readable.from(fileBuffer).pipe(stream);
  });
};

dotenv.config();

export const signUp = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: "User already exists" });

    user = new User({ name, email, password });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();

    const payload = { id: user._id };
    jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" }, (err, token) => {
      if (err) throw err;
      res.json({ token });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    const payload = { id: user._id };
    jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" }, (err, token) => {
      if (err) throw err;
      res.json({ token });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

export const getUserData = async (req, res) => {
  try {
    console.log(
      "🔍 [getUserData] Full user object from token:",
      JSON.stringify(req.user, null, 2)
    );

    let userId =
      req.user.id || req.user.user?.id || req.user._id || req.user.user?._id;

    console.log("🔍 [getUserData] Trying to find user with ID:", userId);

    if (!userId) {
      return res.status(400).json({
        message: "No user ID found in token",
        tokenContents: req.user,
      });
    }

    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({
        message: "User not found in database",
        searchedId: userId,
      });
    }

    res.status(200).json({
      message: "User data retrieved successfully",
      user,
    });
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ message: "Failed to fetch user data" });
  }
};

export const updateUserData = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      name,
      email,
      age,
      height,
      weight,
      gender,
      goal,
      activityLevel,
      varified,
    } = req.body;

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (req.file) {
      try {
        const uploadResult = await uploadFromBuffer(req.file.buffer);
        user.profileImg = uploadResult.secure_url;
      } catch (uploadErr) {
        console.error("❌ Cloudinary upload failed:", uploadErr);
        return res.status(500).json({
          message: "Image upload failed",
          error: uploadErr.message,
        });
      }
    }

    if (name) user.name = name;

    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser && existingUser._id.toString() !== id) {
        return res.status(400).json({ message: "Email already in use" });
      }
      user.email = email;
    }

    if (age) user.age = age;
    if (height) user.height = height;
    if (weight) user.weight = weight;
    if (gender) user.gender = gender;
    if (goal) user.goal = goal;
    if (activityLevel) user.activityLevel = activityLevel;
    if (varified) user.varified = varified;

    await user.save();

    res.status(200).json({
      message: "Profile updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profileImg: user.profileImg,
        age: user.age,
        height: user.height,
        weight: user.weight,
        gender: user.gender,
        goal: user.goal,
        activityLevel: user.activityLevel,
        varified: user.varified,
      },
    });
  } catch (error) {
    console.error("❌ Error updating user data:", error);
    res.status(500).json({ message: "Failed to update user data" });
  }
};

export const updatePlanDate = async (req, res) => {
  try {
    const userId = req.user.id;
    const { lastPlanUpdateAt } = req.body;

    if (!lastPlanUpdateAt) {
      return res.status(400).json({ message: "Date is required" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        lastPlanUpdateAt,
        $inc: { dietDay: 1 },
      },
      { new: true }
    );

    res.status(200).json({
      message: "Plan update date saved",
      user: updatedUser,
    });
  } catch (error) {
    console.log("Error updating plan date:", error);
    res.status(500).json({ message: "Server error" });
  }
};
