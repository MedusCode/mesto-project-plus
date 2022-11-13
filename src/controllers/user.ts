import { Request, Response } from 'express';
import { ObjectId, UpdateQuery } from 'mongoose';
import User, { IUser } from '../models/user';

const handleUserUpdate = (res: Response, id: string | ObjectId, update: UpdateQuery<IUser>) => {
  User.findByIdAndUpdate(id, update, {
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
  const id = req.user._id;
  handleUserUpdate(res, id, { name, about });
};

const updateAvatar = (req: Request, res: Response) => {
  const { avatar } = req.body;
  const id = req.user._id;
  handleUserUpdate(res, id, { avatar });
};

export {
  getUsers, getUserById, createUser, updateUser, updateAvatar,
};
