import dotenv from 'dotenv';
dotenv.config();

import http from 'http';
import { Server } from 'socket.io';
import app from './app.js';
import { connectDB } from './config/db.js';
import { initSockets } from './sockets/index.js';
import { ensureAdminUser } from './controllers/authController.js';

const PORT = process.env.PORT || 4000;

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

app.set('io', io);
initSockets(io);

// Listen immediately on 0.0.0.0 so Vite proxy and Socket.io connect without ECONNREFUSED
server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 NextTrack Backend Server running on port ${PORT}`);
  console.log(`📡 Socket.io server ready`);

  // Connect database and seed admin in background
  connectDB().then((connected) => {
    if (connected) {
      ensureAdminUser();
    }
  });
});
