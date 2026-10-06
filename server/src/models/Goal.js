import mongoose from "mongoose";

const goalSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: String,
    category: {
      type: String,
      enum: ["Sessions", "Techniques", "Durée", "Soumissions", "Autre"],
      default: "Autre",
    },
    target: {
      type: Number,
      required: true,
    },
    progress: {
      type: Number,
      default: 0,
    },
    dueDate: Date,
    status: {
      type: String,
      enum: ["active", "completed", "abandoned"],
      default: "active",
    },
    completedAt: Date,
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);

// Index for efficient queries
goalSchema.index({ userId: 1, status: 1 });

const Goal = mongoose.model("Goal", goalSchema);

export default Goal;
