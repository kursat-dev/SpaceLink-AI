const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');

// Load env vars
require('dotenv').config();

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
    
    // Crucial: bufferCommands false in connect options prevents hang
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000,
    };

    console.log('Establishing new MongoDB connection...');
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

// ----- Express App -----
const app = express();

app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({ origin: true, credentials: true }));

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: { message: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false
});
app.use(apiLimiter);
app.use(express.json({ limit: '10mb' }));

// Language middleware
app.use((req, res, next) => {
  req.language = req.headers['accept-language']?.split(',')[0]?.split('-')[0] || 'en';
  next();
});

// Routes
app.use('/api/auth', require('../server/routes/auth'));
app.use('/api/users', require('../server/routes/users'));
app.use('/api/projects', require('../server/routes/projects'));
app.use('/api/matches', require('../server/routes/matches'));
app.use('/api/recommendations', require('../server/routes/recommendations'));
app.use('/api/messages', require('../server/routes/messages'));
app.use('/api/notifications', require('../server/routes/notifications'));

// Health check (works even if DB is down)
app.get('/api/health', async (req, res) => {
  const dbState = mongoose.connection.readyState;
  const dbStates = { 0: 'disconnected', 1: 'connected', 2: 'connecting', 3: 'disconnecting' };
  res.json({
    status: dbState === 1 ? 'ok' : 'degraded',
    message: 'SpaceLink AI API is running on Vercel',
    timestamp: new Date(),
    diagnostics: {
      db_state: dbStates[dbState] || 'unknown',
      db_ready: dbState === 1,
      has_mongodb_uri: !!process.env.MONGODB_URI,
      has_jwt_secret: !!process.env.JWT_SECRET,
      node_env: process.env.NODE_ENV || 'not set'
    }
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Express Error:', err.stack);
  res.status(err.statusCode || 500).json({
    message: err.message || 'Internal Server Error'
  });
});

// ----- Serverless Handler -----
module.exports = async (req, res) => {
  try {
    // Always connect to DB before handling any request
    await connectDB();
    return app(req, res);
  } catch (error) {
    console.error('SERVERLESS HANDLER ERROR:', error);
    res.status(500).json({
      status: 'error',
      message: 'API boot error',
      debug_error: error.message,
      has_db_uri: !!process.env.MONGODB_URI,
      has_jwt_secret: !!process.env.JWT_SECRET
    });
  }
};
