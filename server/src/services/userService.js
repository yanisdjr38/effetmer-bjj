import User from "../models/User.js";
import { NotFoundError } from "../utils/errorClasses.js";
import logger from "../utils/logger.js";

export const getUserById = async (userId) => {
  const user = await User.findById(userId);

  if (!user || user.deletedAt) {
    throw new NotFoundError("User not found");
  }

  return user.toJSON();
};

export const getUserByEmail = async (email) => {
  const user = await User.findOne({
    email: email.toLowerCase(),
    deletedAt: null,
  });

  if (!user) {
    throw new NotFoundError("User not found");
  }

  return user.toJSON();
};

export const updateUserProfile = async (userId, profileData) => {
  const user = await User.findByIdAndUpdate(
    userId,
    {
      profile: profileData,
      updatedAt: new Date(),
    },
    { new: true, runValidators: true },
  );

  if (!user || user.deletedAt) {
    throw new NotFoundError("User not found");
  }

  logger.info(`User profile updated: ${userId}`);

  return user.toJSON();
};

export const updateUserSettings = async (userId, settings) => {
  const user = await User.findByIdAndUpdate(
    userId,
    {
      settings,
      updatedAt: new Date(),
    },
    { new: true, runValidators: true },
  );

  if (!user || user.deletedAt) {
    throw new NotFoundError("User not found");
  }

  logger.info(`User settings updated: ${userId}`);

  return user.toJSON();
};

export const markHasLocalData = async (userId) => {
  const user = await User.findByIdAndUpdate(
    userId,
    { hasLocalData: true },
    { new: true },
  );

  if (!user) {
    throw new NotFoundError("User not found");
  }

  return user.toJSON();
};

export default {
  getUserById,
  getUserByEmail,
  updateUserProfile,
  updateUserSettings,
  markHasLocalData,
};
