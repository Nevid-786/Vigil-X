import express from 'express';
import { getCards, createCard, updateCard, deleteCard } from '../controllers/cardsController.js';
import { jwtAuth } from '../middleware/jwtAuth.js';

const router = express.Router();

router.use(jwtAuth);

router.get('/', getCards);
router.post('/', createCard);
router.put('/:id', updateCard);
router.delete('/:id', deleteCard);

export default router;
