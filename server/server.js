const express = require('express');
const http = require('http');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const { initSocket } = require('./socket');

dotenv.config();

connectDB();

const app = express();
const server = http.createServer(app);

initSocket(server);

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(require('./middleware/language'));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/matches', require('./routes/matches'));
app.use('/api/recommendations', require('./routes/recommendations'));
app.use('/api/messages', require('./routes/messages'));
app.use('/api/notifications', require('./routes/notifications'));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'SpaceLink AI API is running', timestamp: new Date() });
});

if (process.env.NODE_ENV === 'production') {
  const path = require('path');
  app.use(express.static(path.join(__dirname, '../client/dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
  });
}

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`
  ╔══════════════════════════════════════════╗
  ║     SpaceLink AI API Server             ║
  ║     Running on port ${PORT}               ║
  ║     Socket.IO aktif                      ║
  ║     http://localhost:${PORT}              ║
  ╚══════════════════════════════════════════╝
  `);
});
