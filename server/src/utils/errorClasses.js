export class AppError extends Error {
  constructor(message, code, statusCode = 500, details = null) {
    super(message);
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message, details) {
    super(message, "VALIDATION_ERROR", 400, details);
  }
}

export class AuthenticationError extends AppError {
  constructor(message = "Authentication failed", details = null) {
    super(message, "UNAUTHORIZED", 401, details);
  }
}

export class AuthorizationError extends AppError {
  constructor(message = "Forbidden", details = null) {
    super(message, "FORBIDDEN", 403, details);
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Resource not found", details = null) {
    super(message, "NOT_FOUND", 404, details);
  }
}

export class ConflictError extends AppError {
  constructor(message = "Conflict", details = null) {
    super(message, "CONFLICT", 409, details);
  }
}

export class RateLimitError extends AppError {
  constructor(message = "Too many requests", details = null) {
    super(message, "RATE_LIMIT_EXCEEDED", 429, details);
  }
}

export default {
  AppError,
  ValidationError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  ConflictError,
  RateLimitError,
};
