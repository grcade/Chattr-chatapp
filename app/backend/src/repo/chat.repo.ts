import { sql, ilike } from 'drizzle-orm';
import db from '../db/db.js';
import { chats } from '../db/schema/index.js';
import crypto from 'crypto';

export const create_chat = (
  message: string,
  creatorUsername: string,
  conversationId: string,
  imageUrl: string | null
) => {
  const uuid: string = crypto.randomUUID();

  return db
    .insert(chats)
    .values({
      id: uuid,
      message,
      sender_username: creatorUsername,
      conversation_id: conversationId,
      image_url: imageUrl,
    })
    .returning();
};

export const get_chats_by_conversation_id = (conversationId: string) => {
  return db
    .select()
    .from(chats)
    .where(
      sql`${chats.conversation_id} = ${conversationId} AND ${chats.is_deleted} = false`
    )
    .orderBy(chats.created_at)
    .limit(50);
};

export const delete_chat = (chatId: string) => {
  return db
    .update(chats)
    .set({ is_deleted: true })
    .where(sql`${chats.id} = ${chatId}`);
};

export const update_chat_status = (
  chatId: string,
  status: 'sent' | 'delivered' | 'read'
) => {
  return db
    .update(chats)
    .set({ status })
    .where(sql`${chats.id} = ${chatId}`);
};
