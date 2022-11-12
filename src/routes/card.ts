import { Router } from 'express';
import { createCard, deleteCard, getCards } from '../controllers/card';

const router = Router();

router.get('/', getCards);
router.post('/', createCard);
router.delete('/:id', deleteCard);

export default router;
