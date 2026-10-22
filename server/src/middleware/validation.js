export const validateRegister = (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || !name.trim()) {
    return res.status(400).json({ success: false, message: 'Name is required' });
  }
  if (!email || !email.trim()) {
    return res.status(400).json({ success: false, message: 'Email is required' });
  }
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email.trim())) {
    return res.status(400).json({ success: false, message: 'Please provide a valid email format' });
  }
  if (!password || password.length < 6) {
    return res.status(400).json({
      success: false,
      message: 'Password is required and must be at least 6 characters',
    });
  }

  next();
};

export const validateLogin = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !email.trim()) {
    return res.status(400).json({ success: false, message: 'Email is required' });
  }
  if (!password) {
    return res.status(400).json({ success: false, message: 'Password is required' });
  }

  next();
};

export const validateTask = (req, res, next) => {
  const { title, status, priority } = req.body;

  if (req.method === 'POST') {
    if (!title || !title.trim()) {
      return res.status(400).json({ success: false, message: 'Task title is required' });
    }
    if (title.trim().length > 100) {
      return res.status(400).json({
        success: false,
        message: 'Task title cannot exceed 100 characters',
      });
    }
  }

  if (title !== undefined && title.trim().length === 0) {
    return res.status(400).json({ success: false, message: 'Task title cannot be empty' });
  }

  if (status && !['pending', 'in-progress', 'completed'].includes(status)) {
    return res.status(400).json({
      success: false,
      message: 'Status must be one of: pending, in-progress, completed',
    });
  }

  if (priority && !['low', 'medium', 'high'].includes(priority)) {
    return res.status(400).json({
      success: false,
      message: 'Priority must be one of: low, medium, high',
    });
  }

  next();
};
