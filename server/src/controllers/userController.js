import {
  getUserById,
  updateUserProfile,
  updateUserSettings,
} from "../services/userService.js";

export const getCurrentUser = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    const user = await getUserById(userId);

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const profileData = req.body;

    const user = await updateUserProfile(userId, profileData);

    res.status(200).json({
      success: true,
      message: "Profile updated",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

export const updateSettings = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const settings = req.body;

    const user = await updateUserSettings(userId, settings);

    res.status(200).json({
      success: true,
      message: "Settings updated",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

export default {
  getCurrentUser,
  updateProfile,
  updateSettings,
};
