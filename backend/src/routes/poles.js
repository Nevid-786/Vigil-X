import express from 'express';
import { getPoles } from '../controllers/polesController.js';
import { jwtAuth } from '../middleware/jwtAuth.js';

const router = express.Router();

router.use(jwtAuth);

router.get('/', getPoles);

export default router;
