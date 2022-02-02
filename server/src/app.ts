import './db/mongoose';
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import config from 'config';
import logger from './utils/logger';
import { version } from '../package.json';
import socket from './socket';
const cors = require('cors');

const port = config.get<number>('port');
const host = config.get<string>('host');
const corsOrigin = config.get<string>('corsOrigin');

const app = express();

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: corsOrigin,
    methods: ['GET', 'POST'],
    allowedHeaders: [''],
    credentials: true,
  },
});

app.use(cors());
app.use(express.json());
app.use('/rooms', require('./routes/rooms'));
app.use('/users', require('./routes/users'));
app.use('/messages', require('./routes/messages'));

app.get('/', (_, res) =>
  res.send(`Server is up and running version ${version}`)
);

httpServer.listen(port, host, () => {
  logger.info(`Server version ${version} is listening on port ${port}`);
  logger.info(`http://${host}:${port}`);

  socket({ io });
});
