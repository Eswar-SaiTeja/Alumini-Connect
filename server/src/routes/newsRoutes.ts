import { Router } from 'express';
import {
  getNewsList,
  getNewsById,
  createNews,
  updateNews,
  deleteNews,
} from '../controllers/newsController';
import { requireAuth, optionalAuth, requireRole } from '../middleware/auth';

const router = Router();

router.get('/', optionalAuth, getNewsList);
router.get('/:id', optionalAuth, getNewsById);
router.post('/', requireAuth, requireRole(['SUPER_ADMIN', 'ADMIN', 'CONTENT_MANAGER']), createNews);
router.put('/:id', requireAuth, requireRole(['SUPER_ADMIN', 'ADMIN', 'CONTENT_MANAGER']), updateNews);
router.delete('/:id', requireAuth, requireRole(['SUPER_ADMIN', 'ADMIN']), deleteNews);

export default router;
