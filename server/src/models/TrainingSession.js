import mongoose from "mongoose";

const trainingSessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    date: {
      type: Date,
      required: true,
    },
    duration: {
      type: Number, // in minutes
      required: true,
    },
    trainingType: {
      type: String,
      enum: ["Open Mat", "Fondamentaux", "Avancé", "Lutte", "Conditionnement"],
      default: "Fondamentaux",
    },
    notes: String,
    techniquesLearned: [String], // Array of technique IDs learned
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
trainingSessionSchema.index({ userId: 1, date: -1 });

const TrainingSession = mongoose.model(
  "TrainingSession",
  trainingSessionSchema,
);

export default TrainingSession;
