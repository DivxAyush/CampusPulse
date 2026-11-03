import express from 'express';
import {
  getJobs,
  getJobBySlug,
  createJob,
  updateJob,
  deleteJob,
  applyToJob,
  toggleSaveJob,
  getSavedJobs,
} from './job.controller.js';
import { protect, authorize, optionalAuth } from '../../middleware/auth.middleware.js';

const router = express.Router();

// Public routes
router.get('/', optionalAuth, getJobs);
router.get('/saved', protect, authorize('candidate'), getSavedJobs);
router.get('/:slug', optionalAuth, getJobBySlug);

// Company routes
router.post('/', protect, authorize('company', 'admin'), createJob);
router.put('/:id', protect, authorize('company', 'admin'), updateJob);
router.delete('/:id', protect, authorize('company', 'admin'), deleteJob);

// Candidate actions
router.post('/:id/apply', protect, authorize('candidate'), applyToJob);
router.post('/:id/save', protect, authorize('candidate'), toggleSaveJob);

export default router;
