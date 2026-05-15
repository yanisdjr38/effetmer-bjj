import express from "express";
import {
  getCurrentUser,
  updateProfile,
  updateSettings,
} from "../controllers/userController.js";
import authenticate from "../middleware/auth.js";

const router = express.Router();

// All user routes require authentication
router.use(authenticate);

// GET /api/users/me
router.get("/me", getCurrentUser);

// PUT /api/users/profile
router.put("/profile", updateProfile);

// PUT /api/users/settings
router.put("/settings", updateSettings);

export default router;
