import "dotenv/config";
import app from "./src/app.js";
import { connectDB } from "./src/config/database.js";
import { initializeEmailService } from "./src/config/email.js";
import { validateJwtSecrets } from "./src/config/jwt.js";
import logger from "./src/utils/logger.js";

const PORT = process.env.PORT || 5000;

const start = async () => {
  try {
    // Validate JWT secrets
    validateJwtSecrets();
    logger.info("JWT secrets validated");

    // Connect to database
    await connectDB();
    logger.info("Database connected");

    // Initialize email provider (required for magic links)
    initializeEmailService();

    // Start server
    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
      logger.info(`Environment: ${process.env.NODE_ENV || "development"}`);
    });
  } catch (error) {
    logger.error("Failed to start server:", error);
    process.exit(1);
  }
};

// Handle graceful shutdown
process.on("SIGINT", async () => {
  logger.info("SIGINT received, shutting down gracefully");
  process.exit(0);
});

process.on("SIGTERM", async () => {
  logger.info("SIGTERM received, shutting down gracefully");
  process.exit(0);
});

start();
