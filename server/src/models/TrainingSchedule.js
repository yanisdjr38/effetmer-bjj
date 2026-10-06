import mongoose from "mongoose";

const trainingScheduleSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    day: {
      type: String,
      enum: [
        "Lundi",
        "Mardi",
        "Mercredi",
        "Jeudi",
        "Vendredi",
        "Samedi",
        "Dimanche",
      ],
      required: true,
    },
    startTime: {
      type: String,
      required: true, // Format: "HH:MM"
    },
    endTime: {
      type: String,
      required: true, // Format: "HH:MM"
    },
    trainingType: {
      type: String,
      enum: ["Open Mat", "Fondamentaux", "Avancé", "Lutte", "Conditionnement"],
      default: "Fondamentaux",
    },
    notes: String,
    enabled: {
      type: Boolean,
      default: true,
    },
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
trainingScheduleSchema.index({ userId: 1, day: 1 });

const TrainingSchedule = mongoose.model(
  "TrainingSchedule",
  trainingScheduleSchema,
);

export default TrainingSchedule;
