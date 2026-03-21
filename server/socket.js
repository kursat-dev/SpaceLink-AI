const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const User = require('./models/User');

let io;

function initSocket(httpServer) {
  io = new Server(httpServer, {
    cors: {
      origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:3000'],
      methods: ['GET', 'POST'],
      credentials: true
    }
  });

  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      console.log('Socket handshake denemesi, token:', token ? 'Mevcut' : 'Eksik');
      if (!token) {
        console.error('Socket auth hatasi: Token yok');
        return next(new Error('Authentication error'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select('-password');
      if (!user) {
        return next(new Error('User not found'));
      }

      socket.userId = user._id.toString();
      socket.user = user;
      console.log('Socket auth basarili:', user.name);
      next();
    } catch (err) {
      console.error('Socket auth catch hatasi:', err.message);
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    socket.join(`user:${socket.userId}`);
    console.log(`Socket baglandi: ${socket.user.name} (${socket.userId})`);

    socket.on('disconnect', () => {
      console.log(`Socket ayrildi: ${socket.user.name} (${socket.userId})`);
    });
  });

  return io;
}

function getIO() {
  if (!io) {
    throw new Error('Socket.IO henuz baslatilmadi');
  }
  return io;
}

module.exports = { initSocket, getIO };
