import User from "../models/User.js";

// GET profile
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE profile
export const updateProfile = async (req, res) => {
  try {
    const { bio, location } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { bio, location },
      { new: true }
    ).select("-password");

    res.json({ message: "Profile updated", user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
