import { Server, Socket } from 'socket.io';
import { onlineUsers } from './connection.handler';
import type {
  conversation_type,
  Conversation,
  Chat,
} from '@app/shared/types/user.types';
import {
  createConversationService,
  addUserToConversationService,
  updateLastMessageIdService,
  toggleConversationActiveStatusService,
  deleteConversationService,
} from '../../services/conversation.service';
import { searchUsersService } from '../../services/user.service';
import {
  getChatsByConversationIdService,
  createChatService,
} from '../../services/chat.service';
import { isValidUUID } from '../utils/isValiduuid';

const registerChatHandlers = (io: Server, socket: Socket) => {
  socket.on('chat:request', async (req) => {
    // console.log('Received request: ', req);
    // Here you can handle the incoming chat join request forward it to the intended recipient

    if (!socket.handshake.auth.username) {
      throw new Error('Unauthenticated socket connection');
    }
    const recipientSocket = onlineUsers.get(req.to);
    // console.log(
    //   'Recipient socket id: ',
    //   recipientSocket,
    //   ' for recipient: ',
    //   req.to
    // );
    if (recipientSocket) {
      const convoResult = await createConversationService(
        'private' as conversation_type
      );
      if (!convoResult) {
        console.error('Failed to create conversation for users: ', req.to);
        socket.emit('chat:error', { message: 'Failed to create conversation' });
        return;
      }

      // createConversationService may return an array or a single Conversation
      const conversation: any = Array.isArray(convoResult)
        ? convoResult[0]
        : (convoResult as Conversation);

      if (!conversation || !conversation.id) {
        console.error('Invalid conversation object returned: ', conversation);
        socket.emit('chat:error', { message: 'Invalid conversation data' });
        return;
      }
      await addUserToConversationService(conversation.id, socket.data.userId); // Add the requester to the conversation
      req.conversationId = conversation.id; // Attach the conversation ID to the request object
      req.privateChatId = conversation.id;

      io.to(recipientSocket).emit('chat:request', req);
      // console.log('Forwarded request to recipient: ', req.to);
    } else {
      // console.log('Recipient not connected: ', req.to);
    }
  });

  socket.on('chat:response', async (res) => {
    // console.log('Received response: ', res);
    // here you can handle the resposne accept or reject based on that join the private chat room and send the response back to the requester
    if (!socket.handshake.auth.username) {
      throw new Error('Unauthenticated socket connection');
    }
    const requesterSocket = onlineUsers.get(res.from);
    if (!requesterSocket) {
      // console.log('Requester not connected: ', res.from);
      socket.emit('chat:error ', { message: 'Requester is not connected' });
      return;
    }

    if (res.status === 'accepted') {
      const requestId = res.id;
      const conversationId = res.conversationId;

      if (!conversationId) {
        console.error('No conversation ID provided in response: ', res);
        socket.emit('chat:error', { message: 'Conversation ID is required' });
        return;
      }

      // Join the private chat room
      //on accept just tuen on is_active

      socket.join(conversationId); // Join the recipient to the same private chat room

      io.in(requesterSocket).socketsJoin(conversationId); // Join the requester to the same private chat room
      // have to find id of which user is recipent and then pass it to `addUserToConversationService` to add that user to the conversation
      // console.log('---res---', res);
      // console.log('---conversation---', conversationId);
      // console.log('---socket.data.userId---', socket.data);

      //   const recipientUser: any = await searchUsersService(res.from);
      //   if (!recipientUser || recipientUser.length === 0) {
      //     console.error('Recipient user not found: ', res.to);
      //     socket.emit('chat:error', { message: 'Recipient user not found' });
      //     return;
      //   }
      //   console.log('---recipientUser---', recipientUser);
      await addUserToConversationService(conversationId, socket.data.userId);
      await toggleConversationActiveStatusService(conversationId, true);

      res.conversationId = conversationId;
      res.privateChatId = conversationId;
      res.id = requestId;

      // console.log(
      //   `Both users joined private chat room: ${conversationId} for users: ${res.from} and ${res.to}`
      // );
    }

    //on reject delete the conversation if created
    // console.log(
    //   'this is the res object in chat:response handler---------------><',
    //   res
    // );
    if (res.status === 'rejected' && res.conversationId) {
      await deleteConversationService(res.conversationId);
      // console.log(
      //   `Conversation ${res.conversationId} deleted due to rejection by recipient: ${res.to}`
      // );
    }

    io.to(requesterSocket).emit('chat:response', res);
    socket.emit('chat:response', res);
  });

  socket.on('chat:join', async (data: { conversationId: string }) => {
    const { conversationId } = data;
    if (!conversationId) return;

    if (!isValidUUID(conversationId)) {
      socket.emit('chat:error', {
        conversationId,
        username: socket.data.username,
        message: 'Invalid conversation ID format.',
      });
      return;
    }

    socket.join(conversationId);
  });

  socket.on(
    'chat:message',
    async (data: {
      conversationId: string;
      content: string;
      imageUrl?: string;
    }) => {
      const { conversationId, content, imageUrl } = data;
      if (!conversationId || !content) {
        socket.emit('chat:error', {
          message: 'conversationId and content are required',
        });
        return;
      }

      if (!isValidUUID(conversationId)) {
        console.error(
          `Invalid UUID format received for conversationId: ${conversationId}`
        );
        socket.emit('chat:error', {
          message: 'Invalid conversation ID format.',
        });
        return;
      }
      console.log('content----------->', content);
      const image_url: string | null = data.imageUrl
        ? data.imageUrl.trim()
        : null;
      //   console.log('nickkka', socket.data.userId); //indeed an uuid
      console.log('conversationId----------->', conversationId);
      console.log('user id----------->', socket.data.userId);
      const chatResult = await createChatService(
        content,
        socket.data.username,
        conversationId,
        image_url
      );
      if (!chatResult[0]) {
        console.error(
          'Failed to create chat message for conversation: ',
          conversationId
        );
        socket.emit('chat:error', { message: 'Failed to create chat message' });
        return;
      }

      const createdChat: Chat = chatResult[0];

      await updateLastMessageIdService(conversationId, createdChat.id);

      socket.to(conversationId).emit('chat:message', {
        from: socket.data.username,
        conversationId,
        image_url: createdChat.image_url ?? null,
        content,
        timestamp: new Date(),
      });
    }
  );

  socket.on('chat:history-request', async (data) => {
    const { conversationId } = data;
    if (!conversationId) {
      socket.emit('chat:error', {
        message: 'conversationId is required',
      });
      return;
    }

    const chats = await getChatsByConversationIdService(conversationId);
    console.log('chats----------->', chats);
    socket.emit('chat:history-response', {
      conversationId,
      chats: chats ?? [],
    });
  });
};

export default registerChatHandlers;
