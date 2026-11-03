import express from 'express';
import {
  getApplicationById,
  updateApplicationStatus,
  shortlistCandidate,
  rejectCandidate,
  scheduleInterview,
  getCompanyInterviews,
} from './application.controller.js';
import { protect, authorize } from '../../middleware/auth.middleware.js';

const router = express.Router();

router.use(protect);

router.get('/interviews', authorize('company', 'admin'), getCompanyInterviews);
router.get('/:id', getApplicationById);
router.patch('/:id/status', authorize('company', 'admin'), updateApplicationStatus);
router.post('/:id/shortlist', authorize('company', 'admin'), shortlistCandidate);
router.post('/:id/reject', authorize('company', 'admin'), rejectCandidate);
router.post('/:id/interview', authorize('company', 'admin'), scheduleInterview);

export default router;
