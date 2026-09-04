import { Router } from 'express';
import {
  register,
  login,
  getMe,
  updateProfile,
  addExperience,
  deleteExperience,
  addEducation,
  deleteEducation,
  changePassword,
} from '../controllers/authController';
import { requireAuth } from '../middleware/auth';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', requireAuth, getMe);
router.put('/profile', requireAuth, updateProfile);
router.post('/experience', requireAuth, addExperience);
router.delete('/experience/:id', requireAuth, deleteExperience);
router.post('/education', requireAuth, addEducation);
router.delete('/education/:id', requireAuth, deleteEducation);
router.post('/change-password', requireAuth, changePassword);

export default router;
