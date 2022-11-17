import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config';
import { UnauthorizedError } from '../assets/errors/errors';

interface IJwtToken {
  _id: string;
  iat: number;
  exp: number;
}

function verifyJwtToken(data: unknown): asserts data is IJwtToken {
  if (!(data instanceof Object)) throw new Error('Decoded token error. Token must be an object');
  if (!('_id' in data)) throw new Error('Decoded token error. Missing required field "_id"');
}

const auth = (req: Request, res: Response, next: NextFunction) => {
  const { jwtToken } = req.cookies;

  if (!jwt) {
    next(new UnauthorizedError('Пользователь не авторизован'));
    return;
  }

  if (!JWT_SECRET) {
    next(new Error('Произошла ошибка сервера'));
    return;
  }

  let payload;
  try {
    payload = jwt.verify(jwtToken, JWT_SECRET);
    verifyJwtToken(payload);
  } catch (err) {
    next(new UnauthorizedError('Пользователь не авторизован'));
    return;
  }

  req.user = { _id: payload._id };

  next();
};

export default auth;
