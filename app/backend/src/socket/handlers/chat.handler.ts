import { Server, Socket } from 'socket.io';
import { generateChatId } from '../utils/index';
import { onlineUsers } from './connection.handler';

const registerChatHandlers = (io: Server, socket: Socket) => {
  socket.on('chat:request', async (req) => {
    console.log('Received request: ', req);
    // Here you can handle the incoming chat join request forward it to the intended recipient

    if (!socket.handshake.auth.username && onlineUsers.size === 0) {
      onlineUsers.set(socket.handshake.auth.username, socket.id);
    }
    const recipientSocket = onlineUsers.get(req.to);
    console.log(
      'Recipient socket id: ',
      recipientSocket,
      ' for recipient: ',
      req.to
    );
    if (recipientSocket) {
      io.to(recipientSocket).emit('chat:request', req);
      console.log('Forwarded request to recipient: ', req.to);
    } else {
      console.log('Recipient not connected: ', req.to);
    }
  });

  socket.on('chat:response', async (res) => {
    console.log('Received response: ', res);
    // here you can handle the resposne accept or reject based on that join the private chat room and send the response back to the requester
    const connectedSockets = await io.fetchSockets();
    const requesterSocket = connectedSockets.find(
      (s) => s.handshake.auth.username === res.from
    );
    if (!requesterSocket) {
      console.log('Requester not connected: ', res.from);
      socket.emit('chat:error ', { message: 'Requester is not connected' });
      return;
    }
    if (res.status === 'accepted') {
      // Join the private chat room
      const privateChatId: string = generateChatId(res.from, res.to);

      socket.join(privateChatId);
      requesterSocket.join(privateChatId);
    }
    requesterSocket.emit('chat:response', res);
  });
};

export default registerChatHandlers;
