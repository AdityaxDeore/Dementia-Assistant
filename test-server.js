const { connectDB } = require('./server/db-mongo');

// Test MongoDB connection
connectDB().then(() => {
  console.log('MongoDB connection test completed');
  process.exit(0);
}).catch((error) => {
  console.error('MongoDB connection test failed:', error);
  process.exit(1);
});