import express from 'express';
import {
  createEvent,
  getEvents,
  exportEventsCSV,
  acknowledgeEvent,
  triggerDemoEvent,
} from '../controllers/eventsController.js';
import { apiKeyAuth } from '../middleware/apiKeyAuth.js';
import { jwtAuth } from '../middleware/jwtAuth.js';

const router = express.Router();

// Public / device webhook ingestion endpoint
router.post('/', apiKeyAuth, createEvent);

// Protected dashboard endpoints
router.get('/', jwtAuth, getEvents);
router.get('/export', jwtAuth, exportEventsCSV);
router.patch('/:id/acknowledge', jwtAuth, acknowledgeEvent);

// Demo SOS endpoint (protected by JWT or open for fast UI testing)
router.post('/demo', jwtAuth, triggerDemoEvent);

export default router;
