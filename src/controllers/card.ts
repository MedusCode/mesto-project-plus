import { Request, Response } from 'express';
import { ObjectId, UpdateQuery } from 'mongoose';
import Card, { ICard } from '../models/card';
import { IUser } from '../models/user';

const handleLike = (res: Response, id: string | ObjectId, update: UpdateQuery<ICard>) => {
  Card.findByIdAndUpdate(id, update, {
    new: true,
    runValidators: true,
  })
    .populate<IUser>('owner')
    .then((card) => {
      if (!card) {
        const err = new Error('Карточка не найдена');
        err.name = 'Not Found';
        throw err;
      }
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'Not Found' || err.name === 'CastError') {
        res.status(404).send({ message: 'Карточка не найдена' });
        return;
      }
      res.status(500).send({ message: 'Произошла ошибка сервера' });
    });
};

const getCards = (req: Request, res: Response) => Card.find({})
  .populate<IUser>('owner')
  .then((cards) => res.send({ data: cards }))
  .catch(() => res.status(500).send({ message: 'Произошла ошибка сервера' }));

const createCard = (req: Request, res: Response) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(201).send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные' });
        return;
      }
      res.status(500).send({ message: 'Произошла ошибка сервера' });
    });
};

const deleteCard = (req: Request, res: Response) => {
  const { id } = req.params;
  return Card.findByIdAndRemove(id)
    .then((card) => {
      if (!card) {
        const err = new Error('Карточка не найдена');
        err.name = 'Not Found';
        throw err;
      }
      res.send({ message: 'Карточка успешно удалено' });
    })
    .catch((err) => {
      if (err.name === 'Not Found' || err.name === 'CastError') {
        res.status(404).send({ message: 'Карточка не найдена' });
        return;
      }
      res.status(500).send({ message: 'Произошла ошибка сервера' });
    });
};

const likeCard = (req: Request, res: Response) => {
  const { cardId } = req.params;
  handleLike(res, cardId, { $addToSet: { likes: req.user._id } });
};

const dislikeCard = (req: Request, res: Response) => {
  const { cardId } = req.params;
  handleLike(res, cardId, { $pull: { likes: req.user._id } });
};

export {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
};
