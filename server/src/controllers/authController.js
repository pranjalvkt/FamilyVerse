import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Helper: generate JWT
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

// ---------- Normal Email/Password Auth ----------
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ error: "User already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed, role: "viewer" });
    const token = generateToken(user);
    res.status(201).json({ message: "User registered", token, user });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email }).select("+password");
    if (!user) return res.status(404).json({ error: "User not found" });
    const isMatch = bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

    const token = generateToken(user);
    res.json({ token, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ---------- OAuth / NextAuth Integration ----------
export const authWithProvider = async (req, res) => {
  try {
    const { name, email, image } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        name,
        email,
        image,
        role: "viewer",
        createdAt: new Date(),
      });
      console.log("✅ New OAuth user created:", email);
    } else {
      console.log("ℹ️ Existing OAuth user logged in:", email);
    }

    // 🪪 Generate JWT for this OAuth user
    const token = generateToken(user);
    res.status(200).json({ message: "User authenticated", token, user });
  } catch (err) {
    console.error("❌ OAuth Auth Error:", err);
    res.status(500).json({ error: err.message });
  }
};
