import { Task } from '../models/Task.js';

// @desc    Get all tasks for current user with filtering, search, and pagination
// @route   GET /api/tasks
// @access  Private
export const getTasks = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit, 10) || 6));
    const skip = (page - 1) * limit;

    // Filter by owner by default; admin can view all if explicitly requested
    const filter = {};
    if (req.user.role === 'admin' && req.query.all === 'true') {
      // Admin global view
    } else {
      filter.user = req.user._id;
    }

    // Status filter
    if (req.query.status && ['pending', 'in-progress', 'completed'].includes(req.query.status)) {
      filter.status = req.query.status;
    }

    // Priority filter
    if (req.query.priority && ['low', 'medium', 'high'].includes(req.query.priority)) {
      filter.priority = req.query.priority;
    }

    // Search query in title or description
    if (req.query.q && typeof req.query.q === 'string' && req.query.q.trim()) {
      const sanitized = req.query.q.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      filter.$or = [
        { title: { $regex: sanitized, $options: 'i' } },
        { description: { $regex: sanitized, $options: 'i' } },
      ];
    }

    const total = await Task.countDocuments(filter);
    const tasks = await Task.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('user', 'name email');

    const totalPages = Math.ceil(total / limit) || 1;

    res.status(200).json({
      success: true,
      count: tasks.length,
      total,
      totalPages,
      currentPage: page,
      tasks,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get dashboard metrics / task statistics for user
// @route   GET /api/tasks/stats
// @access  Private
export const getTaskStats = async (req, res, next) => {
  try {
    const filter = { user: req.user._id };

    const total = await Task.countDocuments(filter);
    const pending = await Task.countDocuments({ ...filter, status: 'pending' });
    const inProgress = await Task.countDocuments({ ...filter, status: 'in-progress' });
    const completed = await Task.countDocuments({ ...filter, status: 'completed' });

    res.status(200).json({
      success: true,
      stats: {
        total,
        pending,
        inProgress,
        completed,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single task by ID
// @route   GET /api/tasks/:id
// @access  Private
export const getTaskById = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id).populate('user', 'name email');

    if (!task) {
      return res.status(404).json({
        success: false,
        message: `Task not found with ID ${req.params.id}`,
      });
    }

    // Ownership check (Section 6.6)
    if (task.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You do not have permission to view this task',
      });
    }

    res.status(200).json({
      success: true,
      task,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new task
// @route   POST /api/tasks
// @access  Private
export const createTask = async (req, res, next) => {
  try {
    const { title, description, status, priority, dueDate, tags } = req.body;

    const task = await Task.create({
      user: req.user._id,
      title: title.trim(),
      description: description ? description.trim() : '',
      status: status || 'pending',
      priority: priority || 'medium',
      dueDate: dueDate || null,
      tags: Array.isArray(tags) ? tags.map((t) => String(t).trim()).filter(Boolean) : [],
    });

    res.status(201).json({
      success: true,
      task,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update an existing task
// @route   PUT /api/tasks/:id
// @access  Private
export const updateTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: `Task not found with ID ${req.params.id}`,
      });
    }

    // Ownership check (Section 6.6)
    if (task.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You do not have permission to update this task',
      });
    }

    const { title, description, status, priority, dueDate, tags } = req.body;

    if (title !== undefined) task.title = title.trim();
    if (description !== undefined) task.description = description.trim();
    if (status !== undefined) task.status = status;
    if (priority !== undefined) task.priority = priority;
    if (dueDate !== undefined) task.dueDate = dueDate || null;
    if (tags !== undefined && Array.isArray(tags)) {
      task.tags = tags.map((t) => String(t).trim()).filter(Boolean);
    }

    const updatedTask = await task.save();

    res.status(200).json({
      success: true,
      task: updatedTask,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private
export const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: `Task not found with ID ${req.params.id}`,
      });
    }

    // Ownership check (Section 6.6)
    if (task.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You do not have permission to delete this task',
      });
    }

    await task.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Task successfully deleted',
      deletedId: req.params.id,
    });
  } catch (error) {
    next(error);
  }
};
