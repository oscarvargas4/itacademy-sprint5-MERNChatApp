import { createContext, useContext } from 'react';
import io from 'socket.io-client';
import { SOCKET_URL } from '../config/default';

const socket = io('http://localhost:4000'); // it should be used "SOCKET_URL", but is not working

const SocketContext = createContext({ socket });

function SocketsProvider(props: any) {
  return <SocketContext.Provider value={{ socket }} {...props} />;
}

export const useSockets = () => useContext(SocketContext);

export default SocketsProvider;

// min 24:04
