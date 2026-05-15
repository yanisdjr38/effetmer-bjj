import { AuthenticationError } from "../utils/errorClasses.js";
import logger from "../utils/logger.js";
import { verifyAccessToken } from "../utils/tokenGenerator.js";

export const authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new AuthenticationError("Missing authorization header");
    }

    const parts = authHeader.split(" ");
    if (parts.length !== 2 || parts[0] !== "Bearer") {
      throw new AuthenticationError("Invalid authorization header format");
    }

    const token = parts[1];

    try {
      const payload = verifyAccessToken(token);
      req.user = payload;
      next();
    } catch (error) {
      logger.warn(`Token verification failed: ${error.message}`);
      throw new AuthenticationError("Invalid or expired token");
    }
  } catch (error) {
    next(error);
  }
};

export default authenticate;
