import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  families: [{ type: mongoose.Schema.Types.ObjectId, ref: "Family" }],
});

export const User = mongoose.model("User", userSchema);
