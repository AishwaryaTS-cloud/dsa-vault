const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/dsa-pattern-vault';
  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2000,
    });
    console.log(`[MongoDB Connected]: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.log(`[MongoDB Connection Warning]: ${error.message}`);
    console.log(`[Repository Mode]: Falling back to in-memory store seamlessly.`);
    return false;
  }
};

module.exports = connectDB;
