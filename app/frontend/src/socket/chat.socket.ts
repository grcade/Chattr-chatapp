import { socket } from './socket';
import type {
  ChatJoinRequest,
  ChatJoinResponse,
} from '../store/features/chatRequestsSlice';

export type ChatMessageEvent = {
  from: string;
  conversationId: string;
  content: string;
  image_url?: string | null;
  timestamp: string;
};

export const connectSocket = (username: string | null) => {
  socket.auth = { username: username };
  // console.log('Connecting to socket with username: ', socket.auth.username);
  // so sendign username to the server on connection, so that we can identify the user on the server side
  return () => {
    socket.connect();

    socket.on('connect', () => {
      // console.log('connected to server');
    });

    socket.on('disconnect', () => {
      // console.log('User disconnected');
    });
  };
};

export const disconnectSocket = () => {
  socket.disconnect();
  // console.log('Socket disconnected');
};

export const emitChatRequest = (data: ChatJoinRequest) => {
  socket.emit('chat:request', data);
  // console.log('Emitted chat request to: ', data.to);
};

export const emitJoinConversation = (conversationId: string) => {
  socket.emit('chat:join', { conversationId });
};

export const listenForChatRequests = (
  callback: (req: ChatJoinRequest) => void
) => {
  socket.on('chat:request', callback);

  return () => {
    socket.off('chat:request', callback);
  };
};

export const emitChatResponse = (
  data: ChatJoinRequest,
  status: 'accepted' | 'rejected'
) => {
  socket.emit('chat:response', { ...data, status });
  // console.log('Emitted chat response to: ', data.to, ' with status: ', status);
};

export const listenForChatResponses = (
  callback: (res: ChatJoinResponse) => void
) => {
  socket.on('chat:response', callback);

  return () => {
    socket.off('chat:response', callback);
  };
};

export const emitHistoryRequest = (conversationId: string) => {
  socket.emit('chat:history-request', { conversationId });
  // console.log('Emitted history request for conversation: ', conversationId);
};

export const listenForHistoryResponse = (
  callback: (data: { conversationId: string; username: string; chats: unknown[] }) => void
) => {
  socket.on('chat:history-response', callback);
  return () => {
    socket.off('chat:history-response', callback);
  };
};

export const emitChatMessage = (data: {
  conversationId: string;
  content: string;
  imageUrl?: string;
}) => {
  socket.emit('chat:message', data);
  console.log('Emitted chat message for conversation: ', data.conversationId);
};

export const listenForChatMessages = (
  callback: (data: ChatMessageEvent) => void
) => {
  socket.on('chat:message', callback);
  return () => {
    socket.off('chat:message', callback);
  };
};

export const listenForChatErrors = (
  callback: (data: { message: string }) => void
) => {
  socket.on('chat:error', callback);
  return () => {
    socket.off('chat:error', callback);
  };
};
