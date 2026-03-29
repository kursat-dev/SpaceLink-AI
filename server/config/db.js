const mongoose = require('mongoose');

// ----- Serverless MongoDB Connection (Vercel Official Pattern) -----
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  if (cached.conn) {
    return cached.conn;
  }

  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI is not defined');
  }

  if (!cached.promise) {
    mongoose.set('strictQuery', false);
    
    // Crucial: bufferCommands false prevents hang
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000,
    };

    console.log('Establishing new MongoDB connection in shared config...');
    cached.promise = mongoose.connect(process.env.MONGODB_URI, opts).then((mongooseInstance) => {
      console.log('MongoDB connection established successfully.');
      return mongooseInstance;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    console.error('MongoDB Connection Error:', e.message);
    throw e;
  }

  return cached.conn;
};

module.exports = connectDB;
