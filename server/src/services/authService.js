import bcrypt from "bcrypt";
import { BCRYPT_ROUNDS, MAGIC_LINK_EXPIRY } from "../config/constants.js";
import { sendMagicLinkEmail } from "../config/email.js";
import AuthToken from "../models/AuthToken.js";
import RefreshToken from "../models/RefreshToken.js";
import User from "../models/User.js";
import { AuthenticationError } from "../utils/errorClasses.js";
import logger from "../utils/logger.js";
import {
  generateAccessToken,
  generateMagicLinkToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../utils/tokenGenerator.js";

export const requestMagicLink = async (email) => {
  // Generate token
  const token = generateMagicLinkToken();
  const tokenHash = await bcrypt.hash(token, BCRYPT_ROUNDS);

  // Store hashed token
  const authToken = new AuthToken({
    email,
    tokenHash,
    expiresAt: new Date(Date.now() + MAGIC_LINK_EXPIRY),
  });

  await authToken.save();

  // Construct magic link
  const magicLink = `${process.env.MAGIC_LINK_URL}?token=${token}&email=${encodeURIComponent(email)}`;

  // Send email
  await sendMagicLinkEmail(email, magicLink);

  logger.info(`Magic link requested for ${email}`);

  return {
    email,
    expiresIn: MAGIC_LINK_EXPIRY / 1000, // seconds
  };
};

export const verifyMagicLink = async (email, token) => {
  // Find token record
  const authToken = await AuthToken.findOne({ email });

  if (!authToken) {
    throw new AuthenticationError("Invalid link or email", {
      reason: "token_not_found",
    });
  }

  if (authToken.isUsed) {
    throw new AuthenticationError("Link already used", {
      reason: "token_used",
    });
  }

  if (new Date() > authToken.expiresAt) {
    throw new AuthenticationError("Link expired", { reason: "token_expired" });
  }

  // Verify token
  const isValid = await bcrypt.compare(token, authToken.tokenHash);
  if (!isValid) {
    throw new AuthenticationError("Invalid link", { reason: "token_invalid" });
  }

  // Mark as used
  authToken.isUsed = true;
  authToken.usedAt = new Date();
  await authToken.save();

  // Get or create user
  let user = await User.findOne({ email });
  let isNewUser = false;

  if (!user) {
    user = new User({
      email,
      profile: {
        firstName: "",
        lastName: "",
      },
      hasLocalData: false,
    });
    await user.save();
    isNewUser = true;
    logger.info(`New user created: ${email}`);
  }

  // Generate tokens
  const accessToken = generateAccessToken(user._id.toString(), user.email);
  const refreshToken = generateRefreshToken(user._id.toString());

  // Store refresh token hash
  const refreshTokenHash = await bcrypt.hash(refreshToken, BCRYPT_ROUNDS);
  const storedRefreshToken = new RefreshToken({
    userId: user._id,
    tokenHash: refreshTokenHash,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
  });
  await storedRefreshToken.save();

  logger.info(`User authenticated: ${email}`);

  return {
    user: user.toJSON(),
    tokens: {
      accessToken,
      refreshToken,
    },
    isNewUser,
  };
};

export const refreshAccessToken = async (refreshTokenString) => {
  try {
    // Decode refresh token to get userId
    const decoded = verifyRefreshToken(refreshTokenString);
    const userId = decoded.sub;

    // Find and verify stored token
    const storedTokens = await RefreshToken.find({
      userId,
      revokedAt: null,
      expiresAt: { $gt: new Date() },
    });

    if (!storedTokens.length) {
      throw new AuthenticationError("No valid refresh tokens found", {
        reason: "token_not_found",
      });
    }

    // Verify at least one token matches
    let tokenValid = false;
    for (const token of storedTokens) {
      const matches = await bcrypt.compare(refreshTokenString, token.tokenHash);
      if (matches) {
        tokenValid = true;
        break;
      }
    }

    if (!tokenValid) {
      throw new AuthenticationError("Invalid refresh token", {
        reason: "token_invalid",
      });
    }

    // Get user
    const user = await User.findById(userId);
    if (!user) {
      throw new AuthenticationError("User not found");
    }

    // Generate new access token
    const newAccessToken = generateAccessToken(user._id.toString(), user.email);

    logger.info(`Token refreshed for user: ${user.email}`);

    return {
      accessToken: newAccessToken,
    };
  } catch (error) {
    if (error instanceof AuthenticationError) {
      throw error;
    }
    throw new AuthenticationError("Invalid refresh token", {
      reason: "token_verification_failed",
    });
  }
};

export const logout = async (userId) => {
  // Revoke all refresh tokens for this user
  await RefreshToken.updateMany({ userId }, { revokedAt: new Date() });

  logger.info(`User logged out: ${userId}`);

  return { success: true };
};

export default {
  requestMagicLink,
  verifyMagicLink,
  refreshAccessToken,
  logout,
};
