import { Router } from 'express';
import {
  getAlumniList,
  getAlumniById,
  getFeaturedAlumni,
  getAlumniGeoDistribution,
  getFilterOptions,
} from '../controllers/alumniController';
import { optionalAuth } from '../middleware/auth';

const router = Router();

router.get('/', optionalAuth, getAlumniList);
router.get('/featured', optionalAuth, getFeaturedAlumni);
router.get('/geo', optionalAuth, getAlumniGeoDistribution);
router.get('/filter-options', getFilterOptions);
router.get('/:id', optionalAuth, getAlumniById);

export default router;
