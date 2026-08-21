import dotenv from 'dotenv';
dotenv.config();

import http from 'http';
import { Server } from 'socket.io';
import app from './app.js';
import { connectDB } from './config/db.js';
import { initSockets } from './sockets/index.js';
import { ensureAdminUser } from './controllers/authController.js';

const PORT = process.env.PORT || 4000;

const frontendEnv = process.env.FRONTEND_URL || process.env.CORS_ORIGIN || '*';
const allowedOrigins = frontendEnv === '*'
  ? '*'
  : frontendEnv.split(',').map((o) => o.trim().replace(/\/$/, ''));

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile, curl, n8n) or if wildcard is configured
      if (!origin || allowedOrigins === '*') {
        return callback(null, true);
      }
      const cleanOrigin = origin.replace(/\/$/, '');
      const isAllowed = Array.isArray(allowedOrigins) && allowedOrigins.includes(cleanOrigin);
      if (isAllowed) {
        return callback(null, true);
      }
      // Permissive fallback for production cloud deployments (Vercel -> Render)
      return callback(null, true);
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
  },
  transports: ['websocket', 'polling'],
  allowEIO3: true,
});

app.set('io', io);
initSockets(io);

// Listen on 0.0.0.0 for Cloud Render & local Vite proxy
server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 NextTrack Backend Server running on port ${PORT}`);
  console.log(`📡 Socket.io server ready (allowed origins: ${frontendEnv})`);

  // Connect database and seed admin in background
  connectDB().then((connected) => {
    if (connected) {
      ensureAdminUser();
    }
  });
});
