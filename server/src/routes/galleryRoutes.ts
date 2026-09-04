import { Router } from 'express';
import {
  getGalleryItems,
  createGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
} from '../controllers/galleryController';
import { requireAuth, optionalAuth, requireRole } from '../middleware/auth';

const router = Router();

router.get('/', optionalAuth, getGalleryItems);
router.post('/', requireAuth, requireRole(['SUPER_ADMIN', 'ADMIN', 'CONTENT_MANAGER']), createGalleryItem);
router.put('/:id', requireAuth, requireRole(['SUPER_ADMIN', 'ADMIN', 'CONTENT_MANAGER']), updateGalleryItem);
router.delete('/:id', requireAuth, requireRole(['SUPER_ADMIN', 'ADMIN']), deleteGalleryItem);

export default router;
