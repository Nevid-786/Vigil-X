import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import eventsRoutes from './routes/events.js';
import cardsRoutes from './routes/cards.js';
import polesRoutes from './routes/poles.js';
import analyticsRoutes from './routes/analytics.js';
import systemRoutes from './routes/system.js';
import { errorHandler } from './middleware/errorHandler.js';

dotenv.config();

const app = express();
const isProduction = process.env.NODE_ENV === 'production';

// Security & Cross-Origin Middleware
app.use(helmet({ contentSecurityPolicy: false }));

// Parse FRONTEND_URL / CORS_ORIGIN environment variables
const frontendEnv = process.env.FRONTEND_URL || process.env.CORS_ORIGIN || '*';
const allowedOrigins = frontendEnv === '*' 
  ? '*' 
  : frontendEnv.split(',').map((o) => o.trim().replace(/\/$/, ''));

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins === '*') {
        return callback(null, true);
      }
      const cleanOrigin = origin.replace(/\/$/, '');
      const isAllowed = Array.isArray(allowedOrigins) && allowedOrigins.includes(cleanOrigin);
      if (isAllowed) {
        return callback(null, true);
      }
      return callback(null, true); // Permissive fallback for production cloud deployments
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root & Health Check Endpoint for Render / Cloud Monitors
app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    service: 'NextTrack Command Backend',
    environment: isProduction ? 'production' : 'development',
    timestamp: new Date(),
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'NextTrack API',
    environment: isProduction ? 'production' : 'development',
    timestamp: new Date(),
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventsRoutes);
app.use('/api/cards', cardsRoutes);
app.use('/api/poles', polesRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/system', systemRoutes);

// Global Error Handler
app.use(errorHandler);

export default app;
