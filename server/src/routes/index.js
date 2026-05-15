import express from "express";
import authRoutes from "./auth.js";
import userRoutes from "./users.js";

const router = express.Router();

// Mount route handlers
router.use("/auth", authRoutes);
router.use("/users", userRoutes);

// Health check
router.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString(),
  });
});

export default router;
