import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load unified root .env first, then backend/.env as fallback
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config();

import app from './app.js';
import { connectDB, getIsConnected } from './config/db.js';

const PORT = process.env.PORT || 5000;

// Render.com Keep-Alive Cronjob (Pings /health every 10 minutes to prevent cold start)
const startKeepAliveCron = (port) => {
  const externalUrl = process.env.RENDER_EXTERNAL_URL || process.env.BACKEND_URL;
  const isCloudHost = externalUrl && !externalUrl.includes('localhost') && !externalUrl.includes('127.0.0.1');

  const PING_INTERVAL = 10 * 60 * 1000; // 10 minutes (Render sleeps after 15 mins)

  if (isCloudHost) {
    const targetUrl = `${externalUrl.replace(/\/$/, '')}/health`;
    console.log(`[Keep-Alive Cron]: Scheduled auto-ping every 10 min -> ${targetUrl}`);

    setInterval(async () => {
      try {
        const client = targetUrl.startsWith('https')
          ? (await import('https')).default
          : (await import('http')).default;

        client.get(targetUrl, (res) => {
          console.log(`[Keep-Alive Ping]: ${targetUrl} responded with status ${res.statusCode} at ${new Date().toLocaleTimeString()}`);
        }).on('error', (err) => {
          console.warn(`[Keep-Alive Warning]: Ping failed: ${err.message}`);
        });
      } catch (err) {
        console.warn('[Keep-Alive Error]:', err.message);
      }
    }, PING_INTERVAL);
  } else {
    console.log(`[Keep-Alive Ready]: When deployed on Render, set RENDER_EXTERNAL_URL or hit /health every 10 mins.`);
  }
};

const startServer = async () => {
  // Connect to Database
  await connectDB();

  const server = app.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(`  CAMPUS PLUS API SERVER RUNNING ON PORT ${PORT} `);
    console.log(`  Keep-Alive Health: http://localhost:${PORT}/health`);
    console.log(`  API Health Check:  http://localhost:${PORT}/api/v1/health`);
    console.log(`  Cloudinary: ${process.env.CLOUDINARY_CLOUD_NAME ? 'CONNECTED (' + process.env.CLOUDINARY_CLOUD_NAME + ')' : 'NOT CONFIGURED'}`);
    console.log(`  Database: ${getIsConnected() ? 'CONNECTED (MongoDB Atlas)' : 'IN-MEMORY DEMO MODE'}`);
    console.log(`  Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`====================================================`);

    // Initialize 10-minute keep-alive cron
    startKeepAliveCron(PORT);
  });

  process.on('unhandledRejection', (err) => {
    console.error('Unhandled Promise Rejection:', err);
  });
};

startServer();
