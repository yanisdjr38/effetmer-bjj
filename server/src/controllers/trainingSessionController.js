import TrainingSession from "../models/TrainingSession.js";

/**
 * Get all training sessions for current user
 */
export const getTrainingSessions = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { startDate, endDate } = req.query;

    let query = { userId };

    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const sessions = await TrainingSession.find(query).sort({ date: -1 });

    res.json({
      success: true,
      data: sessions,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get single training session
 */
export const getTrainingSession = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const session = await TrainingSession.findOne({ _id: id, userId });

    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Session not found",
      });
    }

    res.json({
      success: true,
      data: session,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create new training session
 */
export const createTrainingSession = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { date, duration, trainingType, notes, techniquesLearned } = req.body;

    const session = new TrainingSession({
      userId,
      date: new Date(date),
      duration,
      trainingType,
      notes,
      techniquesLearned: techniquesLearned || [],
    });

    await session.save();

    res.status(201).json({
      success: true,
      data: session,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update training session
 */
export const updateTrainingSession = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { date, duration, trainingType, notes, techniquesLearned } = req.body;

    const session = await TrainingSession.findOneAndUpdate(
      { _id: id, userId },
      {
        date: date ? new Date(date) : undefined,
        duration,
        trainingType,
        notes,
        techniquesLearned,
        updatedAt: new Date(),
      },
      { new: true },
    );

    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Session not found",
      });
    }

    res.json({
      success: true,
      data: session,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete training session
 */
export const deleteTrainingSession = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const session = await TrainingSession.findOneAndDelete({ _id: id, userId });

    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Session not found",
      });
    }

    res.json({
      success: true,
      message: "Session deleted",
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get session statistics
 */
export const getSessionStats = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const totalSessions = await TrainingSession.countDocuments({ userId });
    const totalMinutes = await TrainingSession.aggregate([
      { $match: { userId: require("mongoose").Types.ObjectId(userId) } },
      { $group: { _id: null, total: { $sum: "$duration" } } },
    ]);

    res.json({
      success: true,
      data: {
        totalSessions,
        totalMinutes: totalMinutes[0]?.total || 0,
      },
    });
  } catch (error) {
    next(error);
  }
};
