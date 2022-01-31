import { createContext, useContext, useEffect, useState } from 'react';
import io, { Socket } from 'socket.io-client';
import { SOCKET_URL } from '../config/default';
import EVENTS from '../config/events';

interface Context {
  socket: Socket;
  username?: string;
  setUsername: Function;
  messages?: { message: string; time: string; username: string }[];
  setMessages: Function;
  roomId?: string;
  rooms: object;
}

const socket = io(SOCKET_URL);

const SocketContext = createContext<Context>({
  socket,
  setUsername: () => false,
  setMessages: () => false,
  rooms: {},
  messages: [],
});

function SocketsProvider(props: any) {
  const [username, setUsername] = useState('');
  const [roomId, setRoomId] = useState('');
  const [rooms, setRooms] = useState({});
  const [messages, setMessages] = useState([]);

  // Effect on title tab
  useEffect(() => {
    window.onfocus = function () {
      document.title = 'Chat app';
    };

    // const getRooms = async () => {
    //   const roomsFromServer = await fetchRooms();
    //   setRooms(roomsFromServer);
    // };

    // ? getRooms();
  }, []);

  // // Fetch Rooms
  // const fetchRooms = async () => {
  //   const res = await fetch('http://localhost:4000/rooms');
  //   const data = await res.json();

  //   return data;
  // };

  socket.on(EVENTS.SERVER.ROOMS, (value) => {
    setRooms(value);
  });

  socket.on(EVENTS.SERVER.JOINED_ROOM, (value) => {
    setRoomId(value);

    setMessages([]); // TODO add messages persistence - load old messages
  });

  socket.on(EVENTS.SERVER.ROOM_MESSAGE, ({ message, username, time }) => {
    // Effect on title tab "New message"
    if (!document.hasFocus()) {
      document.title = 'New message...';
    }

    setMessages([...messages, { message, username, time }]); // TODO set persistence in database - create message in DB
  });

  return (
    <SocketContext.Provider
      value={{
        socket,
        username,
        setUsername,
        rooms,
        roomId,
        messages,
        setMessages,
      }}
      {...props}
    />
  );
}

export const useSockets = () => useContext(SocketContext);

export default SocketsProvider;
