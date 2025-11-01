import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import testRoutes from "./routes/testRoutes.js";
import healthRoutes from "./routes/healthRoutes.js"
import { logger } from "./middleware/logger.js";

dotenv.config();
connectDB();

const app = express();
app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(logger);


app.get("/", (req, res) => res.send("FamilyVerse backend running 🚀"));
app.use("/api/test", testRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/health", healthRoutes);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

