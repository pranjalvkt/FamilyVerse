import express from "express";
import { createFamily } from "../controllers/familyController.js";
import { authenticate } from "../middleware/authMiddleware.js";
import { requireRole } from "../middleware/requireRole.js";

const router = express.Router();

router.post("/create", authenticate, requireRole("owner", "editor"), createFamily);

export default router;
