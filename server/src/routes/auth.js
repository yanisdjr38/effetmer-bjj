import express from "express";
import {
  postLogout,
  postRefreshToken,
  postRequestMagicLink,
  postVerifyMagicLink,
} from "../controllers/authController.js";
import authenticate from "../middleware/auth.js";
import { authLimiter, magicLinkLimiter } from "../middleware/rateLimiter.js";
import { emailValidator, validate } from "../middleware/validator.js";

const router = express.Router();

// POST /api/auth/request-magic-link
router.post(
  "/request-magic-link",
  magicLinkLimiter,
  emailValidator,
  validate,
  postRequestMagicLink,
);

// POST /api/auth/verify-magic-link
router.post(
  "/verify-magic-link",
  authLimiter,
  emailValidator,
  validate,
  postVerifyMagicLink,
);

// POST /api/auth/refresh-token
router.post("/refresh-token", authLimiter, postRefreshToken);

// POST /api/auth/logout (requires authentication)
router.post("/logout", authenticate, postLogout);

export default router;
