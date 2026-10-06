import {
  logout,
  refreshAccessToken,
  requestMagicLink,
  verifyMagicLink,
} from "../services/authService.js";

export const postRequestMagicLink = async (req, res, next) => {
  try {
    const { email } = req.body;

    const result = await requestMagicLink(email);

    res.status(200).json({
      success: true,
      message: "Magic link sent to email",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const postVerifyMagicLink = async (req, res, next) => {
  try {
    const { email, token } = req.body;

    const result = await verifyMagicLink(email, token);

    res.status(200).json({
      success: true,
      message: "Authentication successful",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const postRefreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        message: "Refresh token is required",
      });
    }

    const result = await refreshAccessToken(refreshToken);

    res.status(200).json({
      success: true,
      message: "Token refreshed",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const postLogout = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    await logout(userId);

    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    next(error);
  }
};

export default {
  postRequestMagicLink,
  postVerifyMagicLink,
  postRefreshToken,
  postLogout,
};
