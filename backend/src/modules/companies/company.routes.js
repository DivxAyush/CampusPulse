import express from 'express';
import {
  getCompanyProfile,
  updateCompanyProfile,
  getCompanyDashboard,
  getCompanyJobs,
  getCompanyApplicants,
  getAllCompanies,
  getCompanyBySlug,
} from './company.controller.js';
import { protect, authorize } from '../../middleware/auth.middleware.js';

const router = express.Router();

// Protected company management routes
router.get('/profile', protect, authorize('company', 'admin'), getCompanyProfile);
router.put('/profile', protect, authorize('company', 'admin'), updateCompanyProfile);
router.get('/dashboard', protect, authorize('company', 'admin'), getCompanyDashboard);
router.get('/jobs', protect, authorize('company', 'admin'), getCompanyJobs);
router.get('/applicants', protect, authorize('company', 'admin'), getCompanyApplicants);

// Public company directory routes
router.get('/', getAllCompanies);
router.get('/:slug', getCompanyBySlug);

export default router;
