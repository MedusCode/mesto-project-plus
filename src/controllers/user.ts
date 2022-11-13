import { Request, Response } from 'express';
import User from '../models/user';

const getUsers = (req: Request, res: Response) => User.find({})
  .then((users) => res.send({ data: users }))
  .catch(() => res.status(500).send({ message: 'Произошла ошибка сервера' }));

const getUserById = (req: Request, res: Response) => User.findById(req.params.id)
  .then((user) => {
    if (!user) {
      const err = new Error('Пользователь не найден');
      err.name = 'Not Found';
      throw err;
    }
    res.send({ data: user });
  })
  .catch((err) => {
    if (err.name === 'Not Found' || err.name === 'CastError') {
      res.status(404).send({ message: 'Пользователь не найден' });
      return;
    }
    res.status(500).send({ message: 'Произошла ошибка сервера' });
  });

const createUser = (req: Request, res: Response) => {
  const { name, about, avatar } = req.body;

  return User.create({ name, about, avatar })
    .then((user) => res.status(201).send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные' });
        return;
      }
      res.status(500).send({ message: 'Произошла ошибка сервера' });
    });
};

const updateUser = (req: Request, res: Response) => {
  const { name, about } = req.body;

  return User.findByIdAndUpdate(req.user._id, { name, about }, {
    new: true,
    runValidators: true,
  })
    .then((user) => {
      if (!user) {
        const err = new Error('Пользователь не найден');
        err.name = 'Not Found';
        throw err;
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'Not Found' || err.name === 'CastError') {
        res.status(404).send({ message: 'Пользователь не найден' });
        return;
      }
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные' });
        return;
      }
      res.status(500).send({ message: 'Произошла ошибка сервера' });
    });
};

const updateAvatar = (req: Request, res: Response) => {
  const { avatar } = req.body;

  return User.findByIdAndUpdate(req.user._id, { avatar }, {
    new: true,
    runValidators: true,
  })
    .then((user) => {
      if (!user) {
        const err = new Error('Пользователь не найден');
        err.name = 'Not Found';
        throw err;
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'Not Found' || err.name === 'CastError') {
        res.status(404).send({ message: 'Пользователь не найден' });
        return;
      }
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные' });
        return;
      }
      res.status(500).send({ message: 'Произошла ошибка сервера' });
    });
};

export {
  getUsers, getUserById, createUser, updateUser, updateAvatar,
};
