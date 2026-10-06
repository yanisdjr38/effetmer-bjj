import rateLimit from "express-rate-limit";
import { RateLimitError } from "../utils/errorClasses.js";

export const createRateLimiter = (options = {}) => {
  const {
    windowMs = 15 * 60 * 1000, // 15 minutes
    max = 100, // limit each IP to 100 requests per windowMs
    message = "Too many requests, please try again later",
    standardHeaders = true,
    legacyHeaders = false,
  } = options;

  return rateLimit({
    windowMs,
    max,
    message,
    standardHeaders,
    legacyHeaders,
    skip: (req) => {
      // Skip rate limiting for health checks
      return req.path === "/health";
    },
    handler: (req, res, next) => {
      const error = new RateLimitError(message, {
        retryAfter: req.rateLimit.resetTime,
      });
      next(error);
    },
  });
};

// Specific rate limiters
export const generalLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

export const authLimiter = createRateLimiter({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // 3 requests per hour
  message: "Too many login attempts, please try again later",
});

export const magicLinkLimiter = createRateLimiter({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // 3 magic link requests per hour
  message: "Too many magic link requests, please try again later",
});

export default {
  createRateLimiter,
  generalLimiter,
  authLimiter,
  magicLinkLimiter,
};
