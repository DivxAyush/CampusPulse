import express from 'express';
import {
  getAdminStats,
  getAdminUsers,
  updateUserStatus,
  getAdminCompanies,
  toggleCompanyVerification,
  getAdminJobs,
  deleteAdminJob,
  getAdminReports,
} from './admin.controller.js';
import { protect, authorize } from '../../middleware/auth.middleware.js';

const router = express.Router();

router.use(protect);
router.use(authorize('admin'));

router.get('/stats', getAdminStats);
router.get('/users', getAdminUsers);
router.patch('/users/:id/status', updateUserStatus);
router.get('/companies', getAdminCompanies);
router.patch('/companies/:id/verify', toggleCompanyVerification);
router.get('/jobs', getAdminJobs);
router.delete('/jobs/:id', deleteAdminJob);
router.get('/reports', getAdminReports);

export default router;
