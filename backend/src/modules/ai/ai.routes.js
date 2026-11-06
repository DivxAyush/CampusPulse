import express from 'express';
import {
  analyzeResume,
  uploadAndAnalyzeResume,
  getLatestAnalysis,
  matchJobForCandidate,
  matchCandidatesForJob,
} from './ai.controller.js';
import { protect, optionalAuth } from '../../middleware/auth.middleware.js';
import { upload } from '../../middleware/upload.middleware.js';

const router = express.Router();

router.get('/resume/latest', protect, getLatestAnalysis);
router.post('/resume/upload-and-analyze', protect, upload.single('resume'), uploadAndAnalyzeResume);
router.post('/resume/analyze', optionalAuth, analyzeResume);
router.post('/matching/jobs', protect, matchJobForCandidate);
router.post('/matching/candidates', protect, matchCandidatesForJob);

export default router;
