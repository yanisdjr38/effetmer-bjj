import crypto from "crypto";
import jwt from "jsonwebtoken";
import jwtConfig from "../config/jwt.js";

export const generateAccessToken = (userId, email) => {
  const payload = {
    userId,
    email,
    type: "access",
  };

  return jwt.sign(payload, jwtConfig.accessTokenSecret, {
    expiresIn: jwtConfig.accessTokenExpiry,
    algorithm: jwtConfig.algorithm,
    audience: jwtConfig.audience,
    issuer: jwtConfig.issuer,
  });
};

export const generateRefreshToken = (userId) => {
  const payload = {
    userId,
    type: "refresh",
    tokenVersion: 1,
  };

  return jwt.sign(payload, jwtConfig.refreshTokenSecret, {
    expiresIn: jwtConfig.refreshTokenExpiry,
    algorithm: jwtConfig.algorithm,
    audience: jwtConfig.audience,
    issuer: jwtConfig.issuer,
  });
};

export const generateMagicLinkToken = () => {
  return crypto.randomBytes(32).toString("hex");
};

export const verifyAccessToken = (token) => {
  try {
    return jwt.verify(token, jwtConfig.accessTokenSecret, {
      algorithms: [jwtConfig.algorithm],
      audience: jwtConfig.audience,
      issuer: jwtConfig.issuer,
    });
  } catch (error) {
    throw new Error(`Invalid access token: ${error.message}`);
  }
};

export const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, jwtConfig.refreshTokenSecret, {
      algorithms: [jwtConfig.algorithm],
      audience: jwtConfig.audience,
      issuer: jwtConfig.issuer,
    });
  } catch (error) {
    throw new Error(`Invalid refresh token: ${error.message}`);
  }
};

export const decodeToken = (token) => {
  return jwt.decode(token);
};

export default {
  generateAccessToken,
  generateRefreshToken,
  generateMagicLinkToken,
  verifyAccessToken,
  verifyRefreshToken,
  decodeToken,
};
