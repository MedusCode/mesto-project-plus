import { NextFunction, Request, Response } from 'express';
import { ObjectId, Types, UpdateQuery } from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/user';
import { JWT_SECRET } from '../config';
import { ConflictError, NotFoundError } from '../assets/errors/errors';

const generateJwtToken = (_id: Types.ObjectId, time?: string) => {
  const expiresIn = time || '7d';

  if (JWT_SECRET) {
    return jwt.sign({ _id }, JWT_SECRET, { expiresIn });
  }
  throw new Error('Произошла ошибка сервера');
};

const saveToHttpOnlyCookie = (res: Response, key: string, value: any, time?: number) => {
  const maxAge = time || 3600000 * 24 * 7;

  return res.cookie(key, value, {
    maxAge,
    httpOnly: true,
  });
};

const handleGetUserById = (res: Response, id: string | ObjectId) => User.findById(id)
  .then((user) => {
    if (!user) {
      throw new NotFoundError('Пользователь не найден');
    }
    res.send({ data: user });
  });

const handleUserUpdate = (
  res: Response,
  id: string | ObjectId,
  update: UpdateQuery<IUser>,
) => User.findByIdAndUpdate(id, update, { new: true, runValidators: true })
  .then((user) => {
    if (!user) throw new NotFoundError('Пользователь не найден');
    res.send({ data: user });
  });

const getUsers = (req: Request, res: Response, next: NextFunction) => User.find({})
  .then((users) => res.send({ data: users }))
  .catch(next);

const getUser = (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  return handleGetUserById(res, id)
    .catch(next);
};

const getMe = (req: Request, res: Response, next: NextFunction) => {
  const { _id } = req.user;

  return handleGetUserById(res, _id)
    .catch(next);
};

const login = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      saveToHttpOnlyCookie(res, 'jwtToken', generateJwtToken(user.id)).send({
        data: {
          _id: user._id,
          name: user.name,
          about: user.about,
          avatar: user.avatar,
          email: user.email,
        },
      });
    })
    .catch(next);
};

const createUser = (req: Request, res: Response, next: NextFunction) => {
  const {
    email, password, name, about, avatar,
  } = req.body;

  return bcrypt.hash(password, 10)
    .then((hash) => User.create({
      email, name, about, avatar, password: hash,
    }))
    .then((user) => {
      saveToHttpOnlyCookie(res, 'jwtToken', generateJwtToken(user._id)).status(201).send({
        data: {
          _id: user._id,
          name: user.name,
          about: user.about,
          avatar: user.avatar,
          email: user.email,
        },
      });
    })
    .catch((err) => {
      if (err.code === 11000) {
        next(new ConflictError('Пользователь с таким email уже существует'));
        return;
      }
      next(err);
    });
};

const updateUser = (req: Request, res: Response, next: NextFunction) => {
  const { name, about } = req.body;
  const id = req.user._id;
  return handleUserUpdate(res, id, { name, about })
    .catch(next);
};

const updateAvatar = (req: Request, res: Response, next: NextFunction) => {
  const { avatar } = req.body;
  const id = req.user._id;
  return handleUserUpdate(res, id, { avatar })
    .catch(next);
};

export {
  getUsers, getUser, createUser, updateUser, updateAvatar, login, getMe,
};
