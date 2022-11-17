import { Router } from 'express';
import {
  createCard, deleteCard, dislikeCard, getCards, likeCard,
} from '../controllers/card';
import { createCardValidator, idParamsValidator } from '../assets/validation/validators';

const router = Router();

router.get('/', getCards);
router.post('/', createCardValidator, createCard);
router.delete('/:id', idParamsValidator, deleteCard);
router.put('/:id/likes', idParamsValidator, likeCard);
router.delete('/:id/likes', idParamsValidator, dislikeCard);

export default router;
