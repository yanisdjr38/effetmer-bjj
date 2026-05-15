import { sendMagicLinkEmail } from "../config/email.js";
import logger from "../utils/logger.js";

export const sendLoginEmail = async (email, magicLink) => {
  try {
    await sendMagicLinkEmail(email, magicLink);
    logger.info(`Login email sent to: ${email}`);
  } catch (error) {
    logger.error(`Failed to send login email to ${email}:`, error);
    throw error;
  }
};

export default {
  sendLoginEmail,
};
