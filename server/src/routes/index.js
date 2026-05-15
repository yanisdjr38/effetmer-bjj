import express from "express";
import achievementsRoutes from "./achievements.js";
import authRoutes from "./auth.js";
import goalsRoutes from "./goals.js";
import sessionsRoutes from "./sessions.js";
import trainingScheduleRoutes from "./trainingSchedule.js";
import userRoutes from "./users.js";

const router = express.Router();

// Mount route handlers
router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/training-schedule", trainingScheduleRoutes);
router.use("/sessions", sessionsRoutes);
router.use("/goals", goalsRoutes);
router.use("/achievements", achievementsRoutes);

// Health check
router.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString(),
  });
});

export default router;
