import { Request, Response } from 'express';
import Card from '../models/card';
import { IUser } from '../models/user';

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

  return Card.findByIdAndUpdate(cardId, { $addToSet: { likes: req.user._id } }, {
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

const dislikeCard = (req: Request, res: Response) => {
  const { cardId } = req.params;

  return Card.findByIdAndUpdate(cardId, { $pull: { likes: req.user._id } }, {
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

export {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
};
