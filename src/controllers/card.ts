import { Request, Response } from 'express';
import Card from '../models/card';

const getCards = (req: Request, res: Response) => Card.find({})
  .then((cards) => res.send({ data: cards }))
  .catch(() => res.status(500).send({ message: 'Произошла ошибка сервера' })); // TODO: центрелизовать ошибку

const createCard = (req: Request, res: Response) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(201).send({ data: card }))
    .catch((err) => res.status(500).send({ message: err.message || 'Произошла ошибка сервера' })); // TODO: изменить код ошибки
};

const deleteCard = (req: Request, res: Response) => {
  const { id } = req.params;
  Card.findById(id)
    .then((card) => {
      if (!card) {
        throw new Error('Фото не найдено');
      }

      return Card.findByIdAndRemove(id);
    })
    .then(() => res.send({ message: 'Фото успешно удалено' }))
    .catch((err) => res.status(500).send({ message: err.message || 'Произошла ошибка сервера' })); // TODO: статус ошибки
};

export { getCards, createCard, deleteCard };
