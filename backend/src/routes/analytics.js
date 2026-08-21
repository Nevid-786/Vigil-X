import express from 'express';
import { getAnalytics } from '../controllers/analyticsController.js';
import { jwtAuth } from '../middleware/jwtAuth.js';

const router = express.Router();

router.use(jwtAuth);
router.get('/', getAnalytics);

export default router;
