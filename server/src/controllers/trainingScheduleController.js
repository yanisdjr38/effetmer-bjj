import TrainingSchedule from "../models/TrainingSchedule.js";

/**
 * Get all training schedules for current user
 */
export const getTrainingSchedules = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const schedules = await TrainingSchedule.find({ userId }).sort({ day: 1 });
    res.json({
      success: true,
      data: schedules,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get training schedule for specific day
 */
export const getTrainingScheduleByDay = async (req, res, next) => {
  try {
    const { day } = req.params;
    const userId = req.user.id;
    const schedules = await TrainingSchedule.find({ userId, day });
    res.json({
      success: true,
      data: schedules,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create new training schedule
 */
export const createTrainingSchedule = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { day, startTime, endTime, trainingType, notes } = req.body;

    const schedule = new TrainingSchedule({
      userId,
      day,
      startTime,
      endTime,
      trainingType,
      notes,
    });

    await schedule.save();
    res.status(201).json({
      success: true,
      data: schedule,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update training schedule
 */
export const updateTrainingSchedule = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { day, startTime, endTime, trainingType, notes, enabled } = req.body;

    const schedule = await TrainingSchedule.findOneAndUpdate(
      { _id: id, userId },
      {
        day,
        startTime,
        endTime,
        trainingType,
        notes,
        enabled,
        updatedAt: new Date(),
      },
      { new: true },
    );

    if (!schedule) {
      return res.status(404).json({
        success: false,
        message: "Schedule not found",
      });
    }

    res.json({
      success: true,
      data: schedule,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete training schedule
 */
export const deleteTrainingSchedule = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const schedule = await TrainingSchedule.findOneAndDelete({
      _id: id,
      userId,
    });

    if (!schedule) {
      return res.status(404).json({
        success: false,
        message: "Schedule not found",
      });
    }

    res.json({
      success: true,
      message: "Schedule deleted",
    });
  } catch (error) {
    next(error);
  }
};
