import { Router } from 'express';
import {
  getUserNotifications,
  markAsRead,
  markAllAsRead,
} from '../controllers/notificationController';
import { requireAuth } from '../middleware/auth';

const router = Router();

router.get('/', requireAuth, getUserNotifications);
router.patch('/:id/read', requireAuth, markAsRead);
router.post('/read-all', requireAuth, markAllAsRead);

export default router;
