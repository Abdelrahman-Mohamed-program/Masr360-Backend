const mongoose = require('mongoose');



const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      maxPoolSize: 20,            // pool size for production
      serverSelectionTimeoutMS: 5000,  // wait max 5s to find server
      socketTimeoutMS: 45000,          // max query duration
      bufferCommands: true,             // queue operations while disconnected
    });

    console.log('MongoDB connected ✅');
  } catch (err) {
    console.error('MongoDB initial connection error:', err);
  }
};

connectDB();

module.exports = connectDB;