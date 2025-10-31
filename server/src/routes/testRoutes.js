import express from "express";
const router = express.Router();

// Controller logic can go in a separate file, but for now keep it inline
router.get("/", (req, res) => {
  res.json({ message: "✅ API is working properly!" });
});

export default router;
