export const jwtConfig = {
  accessTokenSecret:
    process.env.JWT_ACCESS_SECRET ||
    "dev_access_secret_min_32_chars_required_for_security",
  refreshTokenSecret:
    process.env.JWT_REFRESH_SECRET ||
    "dev_refresh_secret_min_32_chars_required_for_security",

  accessTokenExpiry: "15m",
  refreshTokenExpiry: "7d",

  algorithm: "HS256",
  audience: "effetmer-app",
  issuer: "effetmer-backend",
};

export const validateJwtSecrets = () => {
  const { accessTokenSecret, refreshTokenSecret } = jwtConfig;

  if (
    accessTokenSecret.includes("dev_") &&
    process.env.NODE_ENV === "production"
  ) {
    throw new Error("JWT_ACCESS_SECRET must be set in production");
  }

  if (
    refreshTokenSecret.includes("dev_") &&
    process.env.NODE_ENV === "production"
  ) {
    throw new Error("JWT_REFRESH_SECRET must be set in production");
  }

  if (accessTokenSecret.length < 32) {
    throw new Error("JWT_ACCESS_SECRET must be at least 32 characters");
  }

  if (refreshTokenSecret.length < 32) {
    throw new Error("JWT_REFRESH_SECRET must be at least 32 characters");
  }
};

export default jwtConfig;
