import express from "express";
import { registerUser, loginUser, authWithProvider } from "../controllers/authController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/provider", authWithProvider);

export default router;
