import express from 'express';
import {
  registerUser,
  loginUser,
  getCurrentUser,
} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import {
  validateRegister,
  validateLogin,
} from '../middleware/validation.js';

const router = express.Router();

router.post('/register', validateRegister, registerUser);
router.post('/login', validateLogin, loginUser);
router.get('/me', protect, getCurrentUser);

export default router;
