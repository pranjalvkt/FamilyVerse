import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, trim: true },
  email: { type: String, unique: true, required: true, lowercase: true },
  image: { type: String },
  password: { type: String, select: false }, // only for manual login
  role: { 
    type: String, 
    enum: ["owner", "editor", "viewer"], 
    default: "viewer" 
  },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("User", userSchema);
