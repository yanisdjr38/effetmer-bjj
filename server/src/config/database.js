import mongoose from "mongoose";
import logger from "../utils/logger.js";

let isConnected = false;

export const connectDB = async () => {
  if (isConnected) {
    logger.info("Already connected to MongoDB");
    return;
  }

  try {
    const mongoUri = process.env.MONGODB_URI;

    if (!mongoUri) {
      throw new Error("MONGODB_URI is not defined in environment variables");
    }

    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 10000,
    });

    isConnected = true;
    logger.info("✓ Connected to MongoDB");

    // Set up event listeners
    mongoose.connection.on("disconnected", () => {
      logger.warn("MongoDB disconnected");
      isConnected = false;
    });

    mongoose.connection.on("error", (error) => {
      logger.error("MongoDB connection error:", error);
    });

    return mongoose.connection;
  } catch (error) {
    logger.error("Failed to connect to MongoDB:", error);
    process.exit(1);
  }
};

export const disconnectDB = async () => {
  try {
    if (isConnected) {
      await mongoose.disconnect();
      isConnected = false;
      logger.info("✓ Disconnected from MongoDB");
    }
  } catch (error) {
    logger.error("Error disconnecting from MongoDB:", error);
  }
};

export default {
  connectDB,
  disconnectDB,
};
