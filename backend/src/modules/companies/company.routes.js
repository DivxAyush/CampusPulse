import express from 'express';
import {
  getCompanyProfile,
  updateCompanyProfile,
  getCompanyDashboard,
  getCompanyJobs,
  getCompanyApplicants,
} from './company.controller.js';
import { protect, authorize } from '../../middleware/auth.middleware.js';

const router = express.Router();

router.use(protect);
router.use(authorize('company', 'admin'));

router.get('/profile', getCompanyProfile);
router.put('/profile', updateCompanyProfile);
router.get('/dashboard', getCompanyDashboard);
router.get('/jobs', getCompanyJobs);
router.get('/applicants', getCompanyApplicants);

export default router;
