// export const create_chat = (message: string, creatorId: string, conversationId: string, imageUrl: string | null) => {
//   const uuid: string = crypto.randomUUID();

//     return db.insert(chats).values({
//         id: uuid,
//         message,
//         sender_id: creatorId,
//         conversation_id: conversationId,
//         image_url: imageUrl,
//     }).returning();
// }

// export const get_chats_by_conversation_id = (conversationId: string) => {
//     return db.select().from(chats).where(sql`${chats.conversation_id} = ${conversationId} AND ${chats.is_deleted} = false`).orderBy(chats.created_at);
// }

// export const delete_chat = (chatId: string) => {
//     return db.update(chats).set({ is_deleted: true }).where(sql`${chats.id} = ${chatId}`);
// }

// export const update_chat_status = (chatId: string, status: 'sent' | 'delivered' | 'read') => {
//     return db.update(chats).set({ status }).where(sql`${chats.id} = ${chatId}`);
// }
import {
  create_chat,
  get_chats_by_conversation_id,
  delete_chat,
  update_chat_status,
} from '../repo/chat.repo.js';

export const createChatService = (
  message: string,
  creatorId: string,
  conversationId: string,
  imageUrl: string | null
) => {
  message = message.trim().toLowerCase();
  imageUrl = imageUrl ? imageUrl.trim() : null;

  return create_chat(message, creatorId, conversationId, imageUrl);
};

export const getChatsByConversationIdService = (conversationId: string) => {
  return get_chats_by_conversation_id(conversationId);
};

export const deleteChatService = (chatId: string) => {
  return delete_chat(chatId);
};

export const updateChatStatusService = (
  chatId: string,
  status: 'sent' | 'delivered' | 'read'
) => {
  return update_chat_status(chatId, status);
};
