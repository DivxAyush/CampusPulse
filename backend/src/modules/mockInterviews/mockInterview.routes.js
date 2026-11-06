import express from 'express';
import {
  enrollMockInterview,
  getMyMockInterviews,
  cancelMockInterview,
  getAllMockInterviewsAdmin,
  updateMockInterviewStatusAdmin,
} from './mockInterview.controller.js';
import { protect, authorize } from '../../middleware/auth.middleware.js';

const router = express.Router();

// Candidate endpoints
router.post('/enroll', protect, authorize('candidate'), enrollMockInterview);
router.get('/my-status', protect, authorize('candidate'), getMyMockInterviews);
router.delete('/:id', protect, authorize('candidate'), cancelMockInterview);

// Admin endpoints
router.get('/admin/all', protect, authorize('admin'), getAllMockInterviewsAdmin);
router.patch('/admin/:id/status', protect, authorize('admin'), updateMockInterviewStatusAdmin);

export default router;
