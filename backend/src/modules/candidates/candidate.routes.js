import express from 'express';
import {
  getProfile,
  updateProfile,
  getCandidateDashboard,
  uploadResume,
  getResumes,
  deleteResume,
  getCandidateApplications,
  getCandidateRecommendations,
} from './candidate.controller.js';
import { protect, authorize } from '../../middleware/auth.middleware.js';
import { upload } from '../../middleware/upload.middleware.js';

const router = express.Router();

router.use(protect);
router.use(authorize('candidate', 'admin'));

router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.get('/dashboard', getCandidateDashboard);
router.post('/resume', upload.single('resume'), uploadResume);
router.get('/resumes', getResumes);
router.delete('/resume/:id', deleteResume);
router.get('/applications', getCandidateApplications);
router.get('/recommendations', getCandidateRecommendations);

export default router;
