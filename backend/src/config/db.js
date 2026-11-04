import mongoose from 'mongoose';

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
      serverSelectionTimeoutMS: 5000,
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
