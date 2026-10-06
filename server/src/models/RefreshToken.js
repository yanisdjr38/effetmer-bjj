import mongoose from "mongoose";

const refreshTokenSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    tokenHash: {
      type: String,
      required: true,
    },

    metadata: {
      deviceId: {
        type: String,
        default: null,
      },
      ipAddress: {
        type: String,
        default: null,
      },
      userAgent: {
        type: String,
        default: null,
      },
    },

    expiresAt: {
      type: Date,
      required: true,
      index: true,
      expires: 0, // TTL index
    },

    revokedAt: {
      type: Date,
      default: null,
      index: true,
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: false,
  },
);

// Compound index for active sessions
refreshTokenSchema.index({ userId: 1, revokedAt: 1 });
refreshTokenSchema.index({ userId: 1, expiresAt: 1 });

export default mongoose.model("RefreshToken", refreshTokenSchema);
