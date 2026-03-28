const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');

// Load env vars
const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.join(__dirname, '../server/.env') });

// DB connection (cached for serverless)
let isConnected = false;
const connectDB = async () => {
  if (isConnected) return;
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    isConnected = true;
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Error: ${error.message}`);
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
