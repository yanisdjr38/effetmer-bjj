import mongoose from "mongoose";
import { BELT_ORDER } from "../config/constants.js";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Email is invalid",
      ],
      index: true,
    },

    profile: {
      firstName: {
        type: String,
        trim: true,
      },
      lastName: {
        type: String,
        trim: true,
      },
      academy: {
        type: String,
        trim: true,
      },
      belt: {
        type: String,
        enum: BELT_ORDER,
        default: "white",
      },
      weight: {
        type: Number,
        min: 30,
        max: 300,
      },
      yearsOfPractice: {
        type: Number,
        min: 0,
        max: 80,
      },
      weeklyGoal: {
        type: Number,
        min: 1,
        max: 42,
        default: 4,
      },
      preferredTrainingDays: {
        type: [String],
        default: ["Monday", "Wednesday", "Friday", "Saturday"],
      },
      profilePicture: {
        type: String,
        default: null,
      },
    },

    settings: {
      theme: {
        type: String,
        enum: ["light", "dark", "auto"],
        default: "dark",
      },
      language: {
        type: String,
        enum: ["en", "fr", "pt", "es"],
        default: "en",
      },
      notifications: {
        email: {
          type: Boolean,
          default: true,
        },
        push: {
          type: Boolean,
          default: true,
        },
      },
      privacy: {
        shareProgressPublicly: {
          type: Boolean,
          default: false,
        },
        showOnLeaderboard: {
          type: Boolean,
          default: false,
        },
      },
    },

    hasLocalData: {
      type: Boolean,
      default: false,
      description: "Flag indicating user had local data before cloud migration",
    },

    stats: {
      totalSessions: {
        type: Number,
        default: 0,
      },
      totalHours: {
        type: Number,
        default: 0,
      },
      streak: {
        type: Number,
        default: 0,
      },
      longestStreak: {
        type: Number,
        default: 0,
      },
      lastTrainingDate: {
        type: Date,
        default: null,
      },
    },

    createdAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
    v: {
      type: Number,
      default: 1,
    },
  },
  {
    timestamps: false,
  },
);

// Index for querying active users
userSchema.index({ deletedAt: 1 });
userSchema.index({ email: 1, deletedAt: 1 });

// Update timestamps on save
userSchema.pre("save", function (next) {
  if (!this.isNew) {
    this.updatedAt = new Date();
  }
  next();
});

// Prevent returning passwords (future-proofing)
userSchema.methods.toJSON = function () {
  const { __v, ...doc } = this.toObject();
  return doc;
};

export default mongoose.model("User", userSchema);
