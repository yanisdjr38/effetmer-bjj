import express from "express";
import {
  completeGoal,
  createGoal,
  deleteGoal,
  getGoal,
  getGoals,
  updateGoal,
} from "../controllers/goalsController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// Protect all routes
router.use(protect);

/**
 * GET /api/goals
 * Get all goals for current user
 */
router.get("/", getGoals);

/**
 * GET /api/goals/:id
 * Get single goal
 */
router.get("/:id", getGoal);

/**
 * POST /api/goals
 * Create new goal
 */
router.post("/", createGoal);

/**
 * PUT /api/goals/:id
 * Update goal
 */
router.put("/:id", updateGoal);

/**
 * POST /api/goals/:id/complete
 * Mark goal as complete
 */
router.post("/:id/complete", completeGoal);

/**
 * DELETE /api/goals/:id
 * Delete goal
 */
router.delete("/:id", deleteGoal);

export default router;
