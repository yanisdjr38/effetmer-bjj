import express from "express";
import {
  createTrainingSession,
  deleteTrainingSession,
  getSessionStats,
  getTrainingSession,
  getTrainingSessions,
  updateTrainingSession,
} from "../controllers/trainingSessionController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// Protect all routes
router.use(protect);

/**
 * GET /api/sessions
 * Get all training sessions for current user
 */
router.get("/", getTrainingSessions);

/**
 * GET /api/sessions/stats
 * Get session statistics
 */
router.get("/stats", getSessionStats);

/**
 * GET /api/sessions/:id
 * Get single training session
 */
router.get("/:id", getTrainingSession);

/**
 * POST /api/sessions
 * Create new training session
 */
router.post("/", createTrainingSession);

/**
 * PUT /api/sessions/:id
 * Update training session
 */
router.put("/:id", updateTrainingSession);

/**
 * DELETE /api/sessions/:id
 * Delete training session
 */
router.delete("/:id", deleteTrainingSession);

export default router;
