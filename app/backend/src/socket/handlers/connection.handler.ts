import registerChatHandlers from './chat.handler';
import { Server, Socket } from 'socket.io';

export const onlineUsers = new Map<string, string>();

const registerConnectionHandler = (io: Server) => {
  io.on('connection', (socket: Socket) => {
    console.log('a user connected: ', socket.id);

    if (socket.handshake.auth.username) {
      onlineUsers.set(socket.handshake.auth.username, socket.id);
      console.log(onlineUsers);
    }
    socket.on('disconnect', (reason) => {
      console.log('disconnect reason:', reason);

      if (socket.handshake.auth.username) {
        onlineUsers.delete(socket.handshake.auth.username);
        console.log(onlineUsers);
      }
    });

    registerChatHandlers(io, socket);
  });
};

export default registerConnectionHandler;
