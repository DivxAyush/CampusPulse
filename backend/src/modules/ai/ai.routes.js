import express from 'express';
import {
  analyzeResume,
  improveResumeSection,
  matchJobForCandidate,
  matchCandidatesForJob,
} from './ai.controller.js';
import { protect, optionalAuth } from '../../middleware/auth.middleware.js';

const router = express.Router();

router.post('/resume/analyze', optionalAuth, analyzeResume);
router.post('/resume/improve', optionalAuth, improveResumeSection);
router.post('/matching/jobs', protect, matchJobForCandidate);
router.post('/matching/candidates', protect, matchCandidatesForJob);

export default router;
