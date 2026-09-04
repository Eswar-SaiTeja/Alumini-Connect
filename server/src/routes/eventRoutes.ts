import { Router } from 'express';
import {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  registerForEvent,
  cancelRegistration,
  getEventRegistrations,
  updateAttendance,
  exportEventRegistrationsCSV,
} from '../controllers/eventController';
import { requireAuth, optionalAuth, requireRole } from '../middleware/auth';

const router = Router();

// Public / Alumni routes
router.get('/', optionalAuth, getEvents);
router.get('/:id', optionalAuth, getEventById);
router.post('/:id/register', optionalAuth, registerForEvent);
router.post('/:id/cancel', requireAuth, cancelRegistration);

// Admin / Content Manager routes
router.post('/', requireAuth, requireRole(['SUPER_ADMIN', 'ADMIN', 'CONTENT_MANAGER']), createEvent);
router.put('/:id', requireAuth, requireRole(['SUPER_ADMIN', 'ADMIN', 'CONTENT_MANAGER']), updateEvent);
router.delete('/:id', requireAuth, requireRole(['SUPER_ADMIN', 'ADMIN']), deleteEvent);
router.get('/:id/registrations', requireAuth, requireRole(['SUPER_ADMIN', 'ADMIN', 'CONTENT_MANAGER']), getEventRegistrations);
router.patch('/registrations/:registrationId/attendance', requireAuth, requireRole(['SUPER_ADMIN', 'ADMIN', 'CONTENT_MANAGER']), updateAttendance);
router.get('/:id/export-csv', requireAuth, requireRole(['SUPER_ADMIN', 'ADMIN', 'CONTENT_MANAGER']), exportEventRegistrationsCSV);

export default router;
