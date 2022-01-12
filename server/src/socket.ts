import logger from './utils/logger';
import { Server, Socket } from 'socket.io';

const EVENTS = {
  connection: 'connection',
};

function socket({ io }: { io: Server }) {
  logger.info(`Sockets enabled`);

  io.on(EVENTS.connection, (socket: Socket) => {
    logger.info(`User connected ${socket.id}`);
  });
}

export default socket;
