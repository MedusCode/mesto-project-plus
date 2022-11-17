import express from 'express';
import mongoose from 'mongoose';
import { errors } from 'celebrate';
import userRouter from './routes/user';
import cardRouter from './routes/card';
import { DATABASE, PORT } from './config';
import { createUser, login } from './controllers/user';
import auth from './middlewares/auth';
import { requestLogger, errorLogger } from './middlewares/logger';
import errorsHandler from './middlewares/errors-handler';
import { createUserValidator, loginValidator } from './assets/validation/validators';

const cookieParser = require('cookie-parser');

const server = express();

mongoose.connect(DATABASE, { autoIndex: true })
  .then(() => {
    console.log('Connected to mongoDB');
  });

server.use(cookieParser());
server.use(express.json());
server.use(requestLogger);
server.post('/signin', loginValidator, login);
server.post('/signup', createUserValidator, createUser);
server.use(auth);
server.use('/users', userRouter);
server.use('/cards', cardRouter);
server.use(errorLogger);
server.use(errors());
server.use(errorsHandler);

server.listen(PORT);
