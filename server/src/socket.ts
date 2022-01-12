import { nanoid } from 'nanoid';
import logger from './utils/logger';
import { Server, Socket } from 'socket.io';

const EVENTS = {
  connection: 'connection',
  CLIENT: {
    CREATE_ROOM: 'CREATE_ROOM',
  },
  SERVER: {
    ROOMS: 'ROOM',
    JOINED_ROOM: 'JOINED_ROOM',
  },
};

const rooms: Record<string, { name: string }> = {};

function socket({ io }: { io: Server }) {
  logger.info(`Sockets enabled`);

  io.on(EVENTS.connection, (socket: Socket) => {
    logger.info(`User connected ${socket.id}`);

    socket.on(EVENTS.CLIENT.CREATE_ROOM, ({ roomName }) => {
      console.log({ roomName });

      // Create a roomId
      const roomId = nanoid();

      // Add new roomId to the rooms object
      rooms[roomId] = {
        name: roomName,
      };

      // Join to Room
      socket.join(roomId);

      // Broadcast an event when is a new room
      socket.broadcast.emit(EVENTS.SERVER.ROOMS, rooms);

      // emit back to the room creator with all the rooms
      socket.emit(EVENTS.SERVER.ROOMS, rooms);

      // emit event back toroom creator when they have joined a room
      socket.emit(EVENTS.SERVER.JOINED_ROOM, roomId);
    });
  });
}

export default socket;
