const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(require('./middleware/language'));

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/matches', require('./routes/matches'));
app.use('/api/recommendations', require('./routes/recommendations'));
app.use('/api/messages', require('./routes/messages'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'SpaceLink AI API is running', timestamp: new Date() });
});

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  const path = require('path');
  app.use(express.static(path.join(__dirname, '../client/dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
  });
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`
  ╔══════════════════════════════════════════╗
  ║     🚀 SpaceLink AI API Server          ║
  ║     Running on port ${PORT}               ║
  ║     http://localhost:${PORT}              ║
  ╚══════════════════════════════════════════╝
  `);
});
