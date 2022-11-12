import express from 'express';
import mongoose from 'mongoose';
import userRouter from './routes/user';

const { PORT = 3000 } = process.env;
const server = express();

mongoose.connect('mongodb://localhost:27017/mestodb');

server.use(express.json());
server.use('/users', userRouter);

server.listen(PORT);
