import { socket } from './socket';
import type { ChatJoinRequest } from '../store/features/chatRequestsSlice';

export const connectSocket = (username: string | null) => {
  socket.auth = { username: username };
  console.log('Connecting to socket with username: ', socket.auth.username);
  // so sendign username to the server on connection, so that we can identify the user on the server side
  socket.connect();
  socket.on('connect', () => {
    console.log('connected to server');
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
};

export const disconnectSocket = () => {
  socket.disconnect();
  console.log('Socket disconnected');
};

export const emitChatRequest = (data: ChatJoinRequest) => {
  socket.emit('chat:request', data);
  console.log('Emitted chat request to: ', data.to);
};

export const listenForChatRequests = (
  callback: (req: ChatJoinRequest) => void
) => {
  socket.on('chat:request', callback);

  return () => {
    socket.off('chat:request', callback);
  };
};

// export const emitChatResponse = (data : {from: string, to: string, status: 'accepted' | 'rejected'}) => {
//     socket.emit('chat:response', data);
//     console.log("Emitted chat response to: ", data.to)
// }
