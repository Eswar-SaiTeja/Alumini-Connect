import { Router } from 'express';
import { getSettings, updateSettings } from '../controllers/settingsController';
import { requireAuth, requireRole } from '../middleware/auth';

const router = Router();

router.get('/', getSettings);
router.put('/', requireAuth, requireRole(['SUPER_ADMIN', 'ADMIN']), updateSettings);

export default router;
