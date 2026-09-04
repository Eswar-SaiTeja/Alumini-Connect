import { Router } from 'express';
import {
  submitContactMessage,
  getContactMessages,
  updateContactStatus,
  deleteContactMessage,
} from '../controllers/contactController';
import { requireAuth, requireRole } from '../middleware/auth';

const router = Router();

router.post('/', submitContactMessage);
router.get('/', requireAuth, requireRole(['SUPER_ADMIN', 'ADMIN']), getContactMessages);
router.patch('/:id/status', requireAuth, requireRole(['SUPER_ADMIN', 'ADMIN']), updateContactStatus);
router.delete('/:id', requireAuth, requireRole(['SUPER_ADMIN', 'ADMIN']), deleteContactMessage);

export default router;
