import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import path from 'path';
import apiRoutes from './routes/index.js';
import { getHealthPayload } from './utils/healthCheck.js';
import { notFound, errorHandler } from './middleware/error.middleware.js';

const app = express();

// CORS configuration
const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, or same-origin)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(null, true); // Allow during development
      }
    },
    credentials: true,
  })
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());
app.use(morgan('dev'));

// Static uploads serving
app.use('/uploads', express.static(path.resolve('uploads')));

// Direct root health check & ping endpoints (Ideal for Render / cron-job.org / UptimeRobot)
app.get('/health', (req, res) => res.json(getHealthPayload()));
app.get('/ping', (req, res) => res.json(getHealthPayload()));

// Mount routes at /api/v1 and alias /api
app.use('/api/v1', apiRoutes);
app.use('/api', apiRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({
    name: 'Campus Plus API',
    tagline: 'Smart Job Search. Smarter Resumes. Better Opportunities.',
    version: '1.0.0',
    documentation: '/api/v1/health',
    keepAliveEndpoint: '/health',
  });
});

// Error handling
app.use(notFound);
app.use(errorHandler);

export default app;
