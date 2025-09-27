import mongoose from 'mongoose';
import { config } from 'dotenv';

config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/clarity';

// Track connection status
export let isConnected = false;

export const connectDB = async (): Promise<void> => {
  try {
    console.log('🔄 Connecting to MongoDB Atlas...');
    const conn = await mongoose.connect(MONGODB_URI);
    isConnected = true;
    console.log(`✅ MongoDB Atlas Connected: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
  } catch (error) {
    isConnected = false;
    console.log('❌ MongoDB Atlas connection failed');
    console.log('💡 Please check your connection string in .env file');
    console.log('🔍 Make sure:');
    console.log('   1. Username and password are correct');
    console.log('   2. Your IP address is whitelisted in Atlas');
    console.log('   3. Cluster is running and accessible');
    console.log('� Continuing with mock data for development...');
    
    // Log the actual error for debugging (but hide sensitive info)
    const errorMsg = (error as Error).message;
    if (errorMsg.includes('authentication failed')) {
      console.log('� Authentication Error: Check username/password');
    } else if (errorMsg.includes('ENOTFOUND')) {
      console.log('🌐 Network Error: Check cluster URL and internet connection');
    }
  }
};

// Handle connection events
mongoose.connection.on('connected', () => {
  console.log('🔗 Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('⚠️ Mongoose disconnected');
});

// Close connection when app terminates
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('🔒 MongoDB connection closed through app termination');
  process.exit(0);
});

export { mongoose };