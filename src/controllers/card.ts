import { NextFunction, Request, Response } from 'express';
import { ObjectId, UpdateQuery } from 'mongoose';
import Card, { ICard } from '../models/card';
import { IUser } from '../models/user';
import { ForbiddenError, NotFoundError } from '../assets/errors/errors';

const handleLike = (
  res: Response,
  id: string | ObjectId,
  update: UpdateQuery<ICard>,
) => Card.findByIdAndUpdate(id, update, { new: true, runValidators: true })
  .populate<IUser>('owner')
  .then((card) => {
    if (!card) throw new NotFoundError('Карточка не найдена');
    res.send({ data: card });
  });

const getCards = (req: Request, res: Response, next: NextFunction) => Card.find({})
  .populate<IUser>('owner')
  .then((cards) => res.send({ data: cards }))
  .catch(next);

const createCard = (req: Request, res: Response, next: NextFunction) => {
  const { name, link } = req.body;

  return Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(201).send({ data: card }))
    .catch(next);
};

const deleteCard = (req: Request, res: Response, next: NextFunction) => {
  const cardId = req.params.id;
  const userId = req.user._id;

  return Card.findById(cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка не найдена');
      }
      if (card.owner.toString() !== userId) {
        throw new ForbiddenError('Недостаточно прав');
      }
      return Card.findByIdAndRemove(cardId);
    })
    .then(() => res.send({ message: 'Карточка успешно удалено' }))
    .catch(next);
};

const likeCard = (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  return handleLike(res, id, { $addToSet: { likes: req.user._id } })
    .catch(next);
};

const dislikeCard = (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  return handleLike(res, id, { $pull: { likes: req.user._id } })
    .catch(next);
};

export {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
};
