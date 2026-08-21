import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// Mongoose Connection Event Listeners
mongoose.connection.on('error', (err) => {
  console.error(`⚠️ MongoDB Connection Error (${err.code || err.name}):`, err.message);
});

mongoose.connection.on('disconnected', () => {
  console.warn('⚠️ MongoDB disconnected. Retrying connection...');
});

mongoose.connection.on('reconnected', () => {
  console.log('✅ MongoDB reconnected successfully.');
});

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.error('❌ MONGODB_URI is missing in backend/.env file!');
    return false;
  }

  try {
    console.log(`📡 Connecting to MongoDB Atlas database...`);
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 15000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
      family: 4, // Force IPv4 to prevent IPv6 DNS lookup reset errors
    });
    console.log(`✅ MongoDB Atlas Connected successfully: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.error(`❌ MongoDB Atlas Connection Failed: ${error.message}`);
    console.info(`💡 Note: If ECONNRESET persists, ensure your current IP address is added to MongoDB Atlas Network Access rules (0.0.0.0/0 allowed).`);
    return false;
  }
};
