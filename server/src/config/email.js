import { Resend } from "resend";
import logger from "../utils/logger.js";

let emailService = null;

export const initializeEmailService = () => {
  const service = process.env.EMAIL_SERVICE || "resend";

  if (service === "resend") {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      logger.warn("RESEND_API_KEY not set. Email service disabled.");
      return null;
    }
    emailService = new Resend(apiKey);
    logger.info("✓ Email service initialized (Resend)");
  } else {
    logger.warn(
      `Email service "${service}" not implemented yet. Using Resend.`,
    );
    const apiKey = process.env.RESEND_API_KEY;
    if (apiKey) {
      emailService = new Resend(apiKey);
    }
  }

  return emailService;
};

export const getEmailService = () => emailService;

export const sendMagicLinkEmail = async (email, magicLink) => {
  try {
    if (!emailService) {
      throw new Error("Email service not initialized");
    }

    const result = await emailService.emails.send({
      from:
        process.env.EMAIL_FROM ||
        process.env.FROM_EMAIL ||
        "onboarding@resend.dev",
      to: email,
      subject: "🔐 Your EFFETMER Login Link",
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { text-align: center; margin-bottom: 30px; }
              .button { 
                display: inline-block; 
                padding: 12px 30px; 
                background: #59d8e5; 
                color: white; 
                text-decoration: none; 
                border-radius: 8px;
                font-weight: 500;
              }
              .footer { color: #999; font-size: 12px; margin-top: 30px; }
              .info { background: #f5f5f5; padding: 15px; border-radius: 8px; margin: 20px 0; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h2>🥋 EFFETMER</h2>
                <p>Your BJJ Progression Tracker</p>
              </div>
              
              <p>Hi there! 👋</p>
              
              <p>Click the button below to login to EFFETMER. This link expires in 15 minutes.</p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${magicLink}" class="button">Login to EFFETMER</a>
              </div>
              
              <div class="info">
                <p><strong>Or copy this link:</strong></p>
                <p style="word-break: break-all; color: #666; font-size: 12px;">${magicLink}</p>
              </div>
              
              <p style="color: #999; font-size: 12px;">
                If you didn't request this login, please ignore this email.
              </p>
              
              <div class="footer">
                <p>© 2026 EFFETMER. All rights reserved.</p>
                <p>Pursuing excellence in Brazilian Jiu-Jitsu.</p>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    logger.info(`✓ Magic link email sent to ${email}`);
    return result;
  } catch (error) {
    logger.error("Failed to send magic link email:", error);
    throw error;
  }
};

export default {
  initializeEmailService,
  getEmailService,
  sendMagicLinkEmail,
};
