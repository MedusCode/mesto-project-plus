import express from 'express';

const { PORT = 3000 } = process.env;
const server = express();

server.listen(PORT);
