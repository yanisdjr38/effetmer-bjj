import express from "express";
import {
  getAchievements,
  unlockBadge,
  updateAchievements,
} from "../controllers/achievementsController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// Protect all routes
router.use(protect);

/**
 * GET /api/achievements
 * Get achievements for current user
 */
router.get("/", getAchievements);

/**
 * PUT /api/achievements
 * Update achievements
 */
router.put("/", updateAchievements);

/**
 * POST /api/achievements/unlock-badge
 * Unlock badge
 */
router.post("/unlock-badge", unlockBadge);

export default router;
