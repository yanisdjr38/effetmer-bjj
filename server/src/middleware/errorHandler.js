import { AppError } from "../utils/errorClasses.js";
import logger from "../utils/logger.js";

export const errorHandler = (err, req, res, next) => {
  // Default error properties
  let statusCode = 500;
  let code = "INTERNAL_ERROR";
  let message = "Internal server error";
  let details = null;

  // Handle known error types
  if (err instanceof AppError) {
    statusCode = err.statusCode;
    code = err.code;
    message = err.message;
    details = err.details;
  } else if (err.name === "ValidationError") {
    // Mongoose validation error
    statusCode = 400;
    code = "VALIDATION_ERROR";
    message = "Validation failed";
    details = Object.keys(err.errors).reduce((acc, key) => {
      acc[key] = err.errors[key].message;
      return acc;
    }, {});
  } else if (err.code === 11000) {
    // Mongoose duplicate key error
    statusCode = 409;
    code = "DUPLICATE_ENTRY";
    const field = Object.keys(err.keyPattern)[0];
    message = `${field} already exists`;
    details = { field };
  } else if (err.message) {
    message = err.message;
  }

  // Log error
  if (statusCode >= 500) {
    logger.error(`Error [${code}]: ${message}`, err);
  } else {
    logger.warn(`Error [${code}]: ${message}`);
  }

  // Send response
  res.status(statusCode).json({
    success: false,
    code,
    message,
    details,
    timestamp: new Date().toISOString(),
  });
};

export default errorHandler;
