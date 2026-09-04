import { Router } from 'express';
import {
  getStories,
  getStoryById,
  createStory,
  updateStory,
  deleteStory,
} from '../controllers/storyController';
import { requireAuth, optionalAuth, requireRole } from '../middleware/auth';

const router = Router();

router.get('/', optionalAuth, getStories);
router.get('/:id', optionalAuth, getStoryById);
router.post('/', requireAuth, requireRole(['SUPER_ADMIN', 'ADMIN', 'CONTENT_MANAGER']), createStory);
router.put('/:id', requireAuth, requireRole(['SUPER_ADMIN', 'ADMIN', 'CONTENT_MANAGER']), updateStory);
router.delete('/:id', requireAuth, requireRole(['SUPER_ADMIN', 'ADMIN']), deleteStory);

export default router;
