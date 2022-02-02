import { nanoid } from 'nanoid';
import logger from './utils/logger';
import { Server, Socket } from 'socket.io';
import mongoose from 'mongoose';
import { UserModel } from './models/User';
import { RoomModel } from './models/Room';
import MessageModel from './models/Message';

const EVENTS = {
  connection: 'connection',
  CLIENT: {
    CREATE_ROOM: 'CREATE_ROOM',
    SEND_ROOM_MESSAGE: 'SEND_ROOM_MESSAGE',
    JOIN_ROOM: 'JOIN_ROOM',
    USER: 'USER',
  },
  SERVER: {
    ROOMS: 'ROOM',
    JOINED_ROOM: 'JOINED_ROOM',
    ROOM_MESSAGE: 'ROOM_MESSAGE',
  },
};

const rooms: Record<string, { name: string }> = {};

function socket({ io }: { io: Server }) {
  logger.info(`Sockets enabled`);

  io.on(EVENTS.connection, async (socket: Socket) => {
    logger.info(`User connected ${socket.id}`);

    // Username identification // TODO
    socket.on(EVENTS.CLIENT.USER, async (username: string) => {
      let user = await UserModel.findOne({ name: username });

      if (!user) {
        user = new UserModel({
          name: username,
        });
        await user.save();
      }
    });

    socket.emit(EVENTS.SERVER.ROOMS, rooms);

    // When a user creates a new room
    socket.on(EVENTS.CLIENT.CREATE_ROOM, async ({ roomName }) => {
      // TODO Find Room in DB or Create it
      let room = await RoomModel.findOne({ name: roomName });
      if (!room) {
        room = new RoomModel({ name: roomName });
        await room.save();
      }

      // Create a roomId
      // ? const roomId = nanoid();
      const roomId = room.toObject()._id.toString(); // getting ObjectId value from MongoDB _id

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

    // When a user sends a room message
    socket.on(
      EVENTS.CLIENT.SEND_ROOM_MESSAGE,
      async ({ roomId, message, username }) => {
        const date = new Date();
        // TODO register message in DB
        await MessageModel.create({
          room: roomId,
          user: username,
          messageBody: message,
          time: `${date.getHours()}:${date.getMinutes()}`,
        });

        socket.to(roomId).emit(EVENTS.SERVER.ROOM_MESSAGE, {
          message,
          username,
          time: `${date.getHours()}:${date.getMinutes()}`,
        });
      }
    );

    // When a user joins a room
    socket.on(EVENTS.CLIENT.JOIN_ROOM, (roomId) => {
      socket.join(roomId);

      socket.emit(EVENTS.SERVER.JOINED_ROOM, roomId);
    });
  });
}

export default socket;
