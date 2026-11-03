import express from 'express';
import authRoutes from '../modules/auth/auth.routes.js';
import candidateRoutes from '../modules/candidates/candidate.routes.js';
import companyRoutes from '../modules/companies/company.routes.js';
import jobRoutes from '../modules/jobs/job.routes.js';
import applicationRoutes from '../modules/applications/application.routes.js';
import aiRoutes from '../modules/ai/ai.routes.js';
import adminRoutes from '../modules/admin/admin.routes.js';
import supportRoutes from '../modules/support/support.routes.js';

const router = express.Router();

router.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'Campus Plus API v1',
  });
});

router.use('/auth', authRoutes);
router.use('/candidates', candidateRoutes);
router.use('/companies', companyRoutes);
router.use('/jobs', jobRoutes);
router.use('/applications', applicationRoutes);
router.use('/ai', aiRoutes);
router.use('/admin', adminRoutes);
router.use('/support', supportRoutes);

export default router;
