import mongoose from "mongoose";
import { MAGIC_LINK_EXPIRY } from "../config/constants.js";

const authTokenSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    tokenHash: {
      type: String,
      required: true,
    },

    expiresAt: {
      type: Date,
      required: true,
      default: () => new Date(Date.now() + MAGIC_LINK_EXPIRY),
      index: true,
      // TTL index: automatically delete after expiry
      expires: 0,
    },

    isUsed: {
      type: Boolean,
      default: false,
    },

    usedAt: {
      type: Date,
      default: null,
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

// Create TTL index to auto-delete expired tokens
authTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model("AuthToken", authTokenSchema);
