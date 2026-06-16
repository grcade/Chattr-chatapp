import registerChatHandlers from './chat.handler';
import { Server, Socket } from 'socket.io';
import {
  upsertUserService,
  updateUserStatusService,
} from '../../services/user.service';

export const onlineUsers = new Map<string, string>();

const registerConnectionHandler = (io: Server) => {
  io.on('connection', async (socket: Socket) => {
    // console.log('a user connected: ', socket.id);

    if (socket.handshake.auth.username) {
      onlineUsers.set(socket.handshake.auth.username, socket.id);
      console.info(onlineUsers);

      let user: any;
      try {
        user = await upsertUserService(socket.handshake.auth.username);

        await updateUserStatusService(user.id, 'online');

        // console.log('User upserted and status updated: ', user);

        socket.data.username = socket.handshake.auth.username;
        socket.data.userId = user.id;
      } catch (error) {
        console.error('Error occurred while upserting user:', error);
        socket.emit('error', {
          message: 'Internal session initialization error',
        });

        socket.disconnect(true);
      }
    } else {
      console.warn(
        `Socket connected (${socket.id}) without a username payload. Rejecting.`
      );
      socket.disconnect(true);
      return;
    }
    socket.on('disconnect', async (reason) => {
      // console.log('disconnect reason:', reason);

      if (socket.handshake.auth.username) {
        onlineUsers.delete(socket.handshake.auth.username);
try {
      await updateUserStatusService(socket.data.userId, 'offline');
    } catch (error) {
      console.error(`Failed to set user ${socket.data.userId} offline on disconnect:`, error);
      // We don't need to disconnect them because they are already disconnecting!
      // We just catch it so the server stays alive.
    }
        // console.log(onlineUsers);
      }
    });

    registerChatHandlers(io, socket);
  });
};

export default registerConnectionHandler;
