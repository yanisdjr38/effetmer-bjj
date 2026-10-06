import Goal from "../models/Goal.js";

/**
 * Get all goals for current user
 */
export const getGoals = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { status } = req.query;

    let query = { userId };
    if (status) query.status = status;

    const goals = await Goal.find(query).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: goals,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get single goal
 */
export const getGoal = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const goal = await Goal.findOne({ _id: id, userId });

    if (!goal) {
      return res.status(404).json({
        success: false,
        message: "Goal not found",
      });
    }

    res.json({
      success: true,
      data: goal,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create new goal
 */
export const createGoal = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { title, description, category, target, dueDate } = req.body;

    const goal = new Goal({
      userId,
      title,
      description,
      category,
      target,
      dueDate: dueDate ? new Date(dueDate) : null,
      status: "active",
    });

    await goal.save();

    res.status(201).json({
      success: true,
      data: goal,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update goal
 */
export const updateGoal = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { title, description, category, target, progress, dueDate, status } =
      req.body;

    const goal = await Goal.findOneAndUpdate(
      { _id: id, userId },
      {
        title,
        description,
        category,
        target,
        progress,
        dueDate: dueDate ? new Date(dueDate) : undefined,
        status,
        updatedAt: new Date(),
      },
      { new: true },
    );

    if (!goal) {
      return res.status(404).json({
        success: false,
        message: "Goal not found",
      });
    }

    res.json({
      success: true,
      data: goal,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Complete goal
 */
export const completeGoal = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const goal = await Goal.findOneAndUpdate(
      { _id: id, userId },
      {
        status: "completed",
        completedAt: new Date(),
        updatedAt: new Date(),
      },
      { new: true },
    );

    if (!goal) {
      return res.status(404).json({
        success: false,
        message: "Goal not found",
      });
    }

    res.json({
      success: true,
      data: goal,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete goal
 */
export const deleteGoal = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const goal = await Goal.findOneAndDelete({ _id: id, userId });

    if (!goal) {
      return res.status(404).json({
        success: false,
        message: "Goal not found",
      });
    }

    res.json({
      success: true,
      message: "Goal deleted",
    });
  } catch (error) {
    next(error);
  }
};
