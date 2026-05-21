import type { Server, Socket } from 'socket.io';
import registerConnectionHandler from './handlers/connection.handler';

export const setupSocket = (io: Server) => {
  registerConnectionHandler(io);
};
