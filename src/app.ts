import express from 'express';
import mongoose from 'mongoose';

const { PORT = 3000 } = process.env;
const server = express();

mongoose.connect('mongodb://localhost:27017/mestodb');

server.listen(PORT);
