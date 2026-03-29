const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');

// Load env vars
require('dotenv').config();

const connectDB = require('../server/config/db');

// ----- Express App -----
const app = express();
app.set('trust proxy', 1); // Fixes rate-limit X-Forwarded-For warning behind Vercel edge

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
  // We use require('mongoose') directly here to get the api-local state for UI
  // But wait, the shared db.js handles it. Let's just check if connectDB works.
  try {
    await connectDB();
    res.json({
      status: 'ok',
      message: 'SpaceLink AI API is running on Vercel',
      timestamp: new Date(),
      diagnostics: {
        db_state: 'connected',
        db_ready: true,
        has_mongodb_uri: !!process.env.MONGODB_URI,
        has_jwt_secret: !!process.env.JWT_SECRET,
        node_env: process.env.NODE_ENV || 'not set'
      }
    });
  } catch (e) {
    res.json({
      status: 'degraded',
      message: 'MongoDB connection failed',
      timestamp: new Date(),
      diagnostics: { db_error: e.message }
    });
  }
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
