import 'dotenv/config';
import app from './app.js';
import { connectDB, getIsConnected } from './config/db.js';
import { seedDatabase } from './utils/seedData.js';

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  // Connect to Database
  await connectDB();

  // If connected, automatically ensure demo data is populated
  if (getIsConnected()) {
    await seedDatabase();
  }

  const server = app.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(`  CAMPUS PLUS API SERVER RUNNING ON PORT ${PORT} `);
    console.log(`  Health Check: http://localhost:${PORT}/api/v1/health`);
    console.log(`  Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`====================================================`);
  });

  process.on('unhandledRejection', (err) => {
    console.error('Unhandled Promise Rejection:', err);
  });
};

startServer();
