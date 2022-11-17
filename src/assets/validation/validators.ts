import { NextFunction, Request, Response } from 'express';
import { Types } from 'mongoose';
import { celebrate, Joi } from 'celebrate';
import { BadRequestError } from '../errors/errors';
import { urlRegex } from './validateUrl';

const idParamsValidator = (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  if (!Types.ObjectId.isValid(id)) {
    next(new BadRequestError('Передан невозможный id'));
    return;
  }
  next();
};

const loginValidator = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }).required(),
});

const createUserValidator = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(7),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(200),
    avatar: Joi.string().pattern(urlRegex).message('"avatar" must be a valid url'),
  }).required(),
});

const updateUserValidator = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(200),
  }).required().min(1),
});

const updateAvatarValidator = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().pattern(urlRegex).message('"avatar" must be a valid url'),
  }).required(),
});

const createCardValidator = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().pattern(urlRegex).message('"link" must be a valid url'),
  }).required(),
});

export {
  idParamsValidator,
  loginValidator,
  createUserValidator,
  updateUserValidator,
  updateAvatarValidator,
  createCardValidator,
};
