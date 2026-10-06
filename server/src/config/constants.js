const parsedMagicLinkExpiry = Number.parseInt(
  process.env.MAGIC_LINK_EXPIRY || "900000",
  10,
);

export const MAGIC_LINK_EXPIRY = Number.isFinite(parsedMagicLinkExpiry)
  ? parsedMagicLinkExpiry
  : 900000; // 15 minutes
export const MAGIC_LINK_LENGTH = 64; // hex characters
export const MAX_MAGIC_LINK_ATTEMPTS = parseInt(
  process.env.MAX_MAGIC_LINK_ATTEMPTS || "3",
);

export const BCRYPT_ROUNDS = 10;

export const RATE_LIMITS = {
  loginAttempts: 10, // per hour
  magicLinkRequests: 3, // per hour
  generalRequest: 100, // per minute
};

export const ERROR_CODES = {
  INVALID_EMAIL: "INVALID_EMAIL",
  EMAIL_NOT_FOUND: "EMAIL_NOT_FOUND",
  INVALID_TOKEN: "INVALID_TOKEN",
  TOKEN_EXPIRED: "TOKEN_EXPIRED",
  TOKEN_ALREADY_USED: "TOKEN_ALREADY_USED",
  RATE_LIMIT_EXCEEDED: "RATE_LIMIT_EXCEEDED",
  UNAUTHORIZED: "UNAUTHORIZED",
  FORBIDDEN: "FORBIDDEN",
  VALIDATION_ERROR: "VALIDATION_ERROR",
  INTERNAL_ERROR: "INTERNAL_ERROR",
};

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  RATE_LIMITED: 429,
  SERVER_ERROR: 500,
};

export const BELT_ORDER = ["white", "blue", "purple", "brown", "black"];

export default {
  MAGIC_LINK_EXPIRY,
  MAGIC_LINK_LENGTH,
  MAX_MAGIC_LINK_ATTEMPTS,
  BCRYPT_ROUNDS,
  RATE_LIMITS,
  ERROR_CODES,
  HTTP_STATUS,
  BELT_ORDER,
};
