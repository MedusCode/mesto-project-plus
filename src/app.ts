import express from 'express';
import mongoose from 'mongoose';
import userRouter from './routes/user';
import cardRouter from './routes/card';
import fakeAuth from './middlewares/fakeAuth';

const { PORT = 3000 } = process.env;
const server = express();

mongoose.connect('mongodb://localhost:27017/mestodb');

server.use(express.json());
server.use(fakeAuth);
server.use('/users', userRouter);
server.use('/cards', cardRouter);

server.listen(PORT);
