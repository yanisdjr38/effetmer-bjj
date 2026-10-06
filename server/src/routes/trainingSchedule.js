import express from "express";
import {
  createTrainingSchedule,
  deleteTrainingSchedule,
  getTrainingScheduleByDay,
  getTrainingSchedules,
  updateTrainingSchedule,
} from "../controllers/trainingScheduleController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// Protect all routes
router.use(protect);

/**
 * GET /api/training-schedule
 * Get all training schedules for current user
 */
router.get("/", getTrainingSchedules);

/**
 * GET /api/training-schedule/:day
 * Get training schedules for specific day
 */
router.get("/:day", getTrainingScheduleByDay);

/**
 * POST /api/training-schedule
 * Create new training schedule
 */
router.post("/", createTrainingSchedule);

/**
 * PUT /api/training-schedule/:id
 * Update training schedule
 */
router.put("/:id", updateTrainingSchedule);

/**
 * DELETE /api/training-schedule/:id
 * Delete training schedule
 */
router.delete("/:id", deleteTrainingSchedule);

export default router;
