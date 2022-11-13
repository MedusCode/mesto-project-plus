import { Request, Response } from 'express';
import User from '../models/user';

const getUsers = (req: Request, res: Response) => User.find({})
  .then((users) => res.send({ data: users }))
  .catch(() => res.status(500).send({ message: 'Произошла ошибка сервера' })); // TODO: центрелизовать ошибку

const getUserById = (req: Request, res: Response) => User.findById(req.params.id)
  .then((user) => res.send({ data: user }))
  .catch(() => res.status(500).send({ message: 'Произошла ошибка сервера' }));

const createUser = (req: Request, res: Response) => {
  const { name, about, avatar } = req.body;

  return User.create({ name, about, avatar })
    .then((user) => res.status(201).send({ data: user }))
    .catch((err) => res.status(500).send({ message: err.message || 'Произошла ошибка сервера' })); // TODO: изменить код ошибки
};

const updateUser = (req: Request, res: Response) => {
  const { name, about } = req.body;
  return User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new Error('Пользователь не найден');
      }

      return User.findByIdAndUpdate(req.user._id, { name, about }, {
        new: true,
        runValidators: true,
      });
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => res.status(500).send({ message: err.message || 'Произошла ошибка сервера' }));
};

const updateAvatar = (req: Request, res: Response) => {
  const { avatar } = req.body;

  return User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new Error('Пользователь не найден');
      }
      return User.findByIdAndUpdate(req.user._id, { avatar }, {
        new: true,
        runValidators: true,
      });
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => res.status(500).send({ message: err.message || 'Произошла ошибка сервера' }));
};

export {
  getUsers, getUserById, createUser, updateUser, updateAvatar,
};
