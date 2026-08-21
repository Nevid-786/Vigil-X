import express from 'express';
import { getSystemHealth } from '../controllers/systemController.js';
import { jwtAuth } from '../middleware/jwtAuth.js';

const router = express.Router();

router.use(jwtAuth);
router.get('/health', getSystemHealth);

export default router;
