import mongoose from 'mongoose';
import dns from 'dns';

// Fix for Windows / local ISPs where default DNS resolver fails on SRV records (_mongodb._tcp)
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {
  // Ignore in sandboxed cloud containers
}

let isConnected = false;

export const connectDB = async () => {
  if (isConnected) return;

  const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/campusplus_ai';

  if (mongoUri.includes('<db_password>') || mongoUri.includes('<password>')) {
    console.warn(`[MongoDB Atlas Notice]: MONGODB_URI contains placeholder "<db_password>".`);
    console.warn(`[Action Required]: Please update the password in the root .env file to enable live MongoDB Atlas data.`);
    console.warn(`[Fallback]: Operating in resilient in-memory mode so all APIs and UI continue working.`);
    mongoose.set('bufferCommands', false);
    isConnected = false;
    return;
  }

  try {
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 15000,
    });
    isConnected = true;
    console.log(`[MongoDB Connected]: ${conn.connection.host}/${conn.connection.name}`);
  } catch (error) {
    console.warn(`[MongoDB Warning]: Could not connect to MongoDB at ${mongoUri.replace(/:([^@]+)@/, ':****@')}. Operating in in-memory fallback mode.`);
    console.warn(`[Details]: ${error.message}`);
    mongoose.set('bufferCommands', false);
    isConnected = false;
  }
};

export const getIsConnected = () => isConnected;
