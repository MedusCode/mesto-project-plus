import express from 'express';
import mongoose from 'mongoose';
import userRouter from './routes/user';
import cardRouter from './routes/card';
import fakeAuth from './middlewares/fakeAuth';
import { DATABASE, PORT } from './config';

const server = express();

mongoose.connect(DATABASE);

server.use(express.json());
server.use(fakeAuth);
server.use('/users', userRouter);
server.use('/cards', cardRouter);

server.listen(PORT);
