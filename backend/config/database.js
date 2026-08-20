const mongoose = require('mongoose');

const connectDB = async () => {
  const primaryUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/tms_test';
  const fallbackUri = 'mongodb://localhost:27017/tms_test';

  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(primaryUri);
    console.log('MongoDB Connected Successfully');
  } catch (error) {
    console.error('Primary MongoDB connection error:', error.message);
    if (primaryUri !== fallbackUri) {
      try {
        console.log('Attempting fallback to local MongoDB (mongodb://localhost:27017/tms_test)...');
        await mongoose.connect(fallbackUri);
        console.log('Connected to local MongoDB successfully!');
        return;
      } catch (fallbackError) {
        console.error('Fallback MongoDB connection error:', fallbackError.message);
      }
    }
    process.exit(1);
  }
};

module.exports = connectDB;
