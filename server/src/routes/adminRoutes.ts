import { Router } from 'express';
import {
  getDashboardStats,
  getUsers,
  updateUser,
  deleteUser,
  bulkUserAction,
  verifyAlumni,
  getAuditLogs,
  exportAlumniCSV,
  importAlumniCSV,
} from '../controllers/adminController';
import { requireAuth, requireRole } from '../middleware/auth';
import { upload } from '../middleware/upload';

const router = Router();

// Protect all admin routes with authentication & Admin / SuperAdmin role
router.use(requireAuth);
router.use(requireRole(['SUPER_ADMIN', 'ADMIN']));

router.get('/dashboard-stats', getDashboardStats);
router.get('/users', getUsers);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);
router.post('/users/bulk', bulkUserAction);
router.patch('/alumni/:id/verify', verifyAlumni);
router.get('/audit-logs', getAuditLogs);
router.get('/alumni/export-csv', exportAlumniCSV);
router.post('/alumni/import-csv', upload.single('file'), importAlumniCSV);

export default router;
