const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');

// Load env vars (dotenv is still useful for local development if needed)
require('dotenv').config();

// DB connection (cached for serverless)
// Initialize mongoose but don't connect yet
let isConnected = false;

const connectDB = async () => {
  if (isConnected) return;
  
  if (!process.env.MONGODB_URI) {
    console.error('CRITICAL: MONGODB_URI is not defined in environment variables!');
    throw new Error('MONGODB_URI is missing');
  }

  try {
    mongoose.set('strictQuery', false);
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
    });
    isConnected = !!conn.connections[0].readyState;
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    throw error;
  }
};

const app = express();

// Security
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({ origin: true, credentials: true }));

// Rate limiting
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

// Routes — resolve from server folder
app.use('/api/auth', require('../server/routes/auth'));
app.use('/api/users', require('../server/routes/users'));
app.use('/api/projects', require('../server/routes/projects'));
app.use('/api/matches', require('../server/routes/matches'));
app.use('/api/recommendations', require('../server/routes/recommendations'));
app.use('/api/messages', require('../server/routes/messages'));
app.use('/api/notifications', require('../server/routes/notifications'));

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
      mongodb_uri_prefix: process.env.MONGODB_URI ? process.env.MONGODB_URI.substring(0, 20) + '...' : 'NOT SET',
      has_jwt_secret: !!process.env.JWT_SECRET,
      node_env: process.env.NODE_ENV || 'not set'
    }
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Express Error:', err.stack);
  res.status(err.statusCode || 500).json({
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Export as serverless handler
module.exports = async (req, res) => {
  const url = req.url || '';
  const isHealthCheck = url.includes('/api/health');

  try {
    // 1. Diagnostics (logs only)
    if (!process.env.MONGODB_URI) console.warn('DIAGNOSTIC: MONGODB_URI is missing');
    if (!process.env.JWT_SECRET) console.warn('DIAGNOSTIC: JWT_SECRET is missing');

    // 2. Database Connection
    try {
      await connectDB();
    } catch (dbError) {
      console.error('Database connection failed in handler:', dbError.message);
      // If it's a health check, we continue so we can return a "degraded" status
      if (!isHealthCheck) {
        throw dbError; // Rethrow to be caught by the outer catch
      }
    }

    // 3. App Execution
    return app(req, res);

  } catch (error) {
    console.error('CRITICAL SERVERLESS CRASH:', error);
    
    // Return a JSON error instead of crashing the function
    res.status(500).json({
      status: 'error',
      message: 'The SpaceLink AI API encountered a critical boot error.',
      debug: {
        type: error.name,
        message: error.message,
        has_db_uri: !!process.env.MONGODB_URI,
        has_jwt_secret: !!process.env.JWT_SECRET,
        timestamp: new Date().toISOString()
      }
    });
  }
};
