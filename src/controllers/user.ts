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
    .catch((err) => res.status(500).send({ message: err || 'Произошла ошибка сервера' })); // TODO: изменить код ошибки
};

export { getUsers, getUserById, createUser };
