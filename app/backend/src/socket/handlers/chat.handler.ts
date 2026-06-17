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

type ChatJoinRequestPayload = {
  id: string;
  from: string;
  to: string | string[];
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: number;
  updatedAt: number;
  conversationId?: string;
  privateChatId?: string;
  type?: conversation_type;
};

const registerChatHandlers = (io: Server, socket: Socket) => {
  socket.on('chat:request', async (req: ChatJoinRequestPayload) => {
    if (!socket.handshake.auth.username) {
      throw new Error('Unauthenticated socket connection');
    }

    const recipientUsernames = Array.isArray(req.to) ? req.to : [req.to];
    const recipientSockets = recipientUsernames.map((username) =>
      onlineUsers.get(username)
    );

    if (recipientSockets.length === 0) {
      return;
    }

    const convoResult = await createConversationService(
      (req.type ?? 'private') as conversation_type
    );
    console.log('Conversation creation result: ', convoResult);
    if (!convoResult) {
      console.error('Failed to create conversation for users: ', req.to);
      socket.emit('chat:error', { message: 'Failed to create conversation' });
      return;
    }

    const conversation: any = Array.isArray(convoResult)
      ? convoResult[0]
      : (convoResult as Conversation);

    if (!conversation || !conversation.id) {
      console.error('Invalid conversation object returned: ', conversation);
      socket.emit('chat:error', { message: 'Invalid conversation data' });
      return;
    }

    await addUserToConversationService(conversation.id, socket.data.userId);
    req.conversationId = conversation.id;
    req.privateChatId = conversation.id;

    recipientSockets.forEach((recipientSocket) => {
      if (!recipientSocket) return;
      io.to(recipientSocket).emit('chat:request', req);
    });
  });

  socket.on('chat:response', async (res: ChatJoinRequestPayload) => {
    try {
      if (!socket.handshake.auth.username) {
        throw new Error('Unauthenticated socket connection');
      }

      const requesterSocket = onlineUsers.get(res.from);

        console.log('Chat response received: ', res, socket.data.username);

      if (!requesterSocket) {
        socket.emit('chat:error', {
          message: 'Requester is not connected',
        });
        return;
      }

      if (res.status === 'accepted') {
        const conversationId = res.conversationId;

        if (!conversationId) {
          socket.emit('chat:error', {
            message: 'Conversation ID is required',
          });
          return;
        }

        const requestId = res.id;

        // Add accepter socket to room
        socket.join(conversationId);

        // Add requester socket to room
        io.in(requesterSocket).socketsJoin(conversationId);

        // Add accepter to DB conversation members
        await addUserToConversationService(conversationId, socket.data.userId);

        // Handle all invited users
        const recipients = Array.isArray(res.to) ? res.to : [res.to];

        await Promise.all(
          recipients.map(async (username) => {
            try {
              const users = await searchUsersService(username);
              const user = Array.isArray(users) ? users[0] : users;

              if (!user?.id) {
                console.warn(
                  `User not found while adding to conversation: ${username}`
                );
                return;
              }
              console.log(
                username,
                conversationId,
                'Adding user to conversation'
              );
              await addUserToConversationService(conversationId, user.id);

              const recipientSocket = onlineUsers.get(username);

              if (recipientSocket) {
                io.in(recipientSocket).socketsJoin(conversationId);
              }
            } catch (err) {
              console.error(`Failed adding ${username} to conversation`, err);
            }
          })
        );

        await toggleConversationActiveStatusService(conversationId, true);

        res.id = requestId;
        res.privateChatId = conversationId;
        res.conversationId = conversationId;
      }

      if (res.status === 'rejected' && res.conversationId) {
        await deleteConversationService(res.conversationId);
      }

      // Notify requester
      io.to(requesterSocket).emit('chat:response', res);

      // Notify current responder
      socket.emit('chat:response', res);

      // Notify all recipients (for group chats)
      const recipients = Array.isArray(res.to) ? res.to : [res.to];

      recipients.forEach((username) => {
        const recipientSocket = onlineUsers.get(username);

        if (recipientSocket) {
          io.to(recipientSocket).emit('chat:response', res);
        }
      });
    } catch (error) {
      console.error('chat:response error:', error);

      socket.emit('chat:error', {
        message: 'Failed to process chat response',
      });
    }
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

      const image_url: string | null = imageUrl ? imageUrl.trim() : null;

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
    socket.emit('chat:history-response', {
      conversationId,
      chats: chats ?? [],
    });
  });
};

export default registerChatHandlers;
