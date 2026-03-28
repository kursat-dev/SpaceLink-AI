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

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'SpaceLink AI API is running on Vercel', timestamp: new Date() });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    message: err.message || 'Internal Server Error'
  });
});

// Export as serverless handler
module.exports = async (req, res) => {
  await connectDB();
  return app(req, res);
};
