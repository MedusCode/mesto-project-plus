import { NextFunction, Request, Response } from 'express';
import { IError } from '../assets/errors/errors';

const errorsHandler = (err: IError, req: Request, res: Response, next: NextFunction) => {
  const { code, message } = err;

  if (code) {
    res.status(code).send({ message: message || 'Произошла ошибка' });
    next();
    return;
  }

  res.status(500).send({ message: 'Произошла ошибка сервера' });

  next();
};

export default errorsHandler;
