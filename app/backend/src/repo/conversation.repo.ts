import { sql, ilike } from 'drizzle-orm';
import db from '../db/db.js';
import { conversations, conversationParticipants } from '../db/schema/index.js';
import type { conversation_type } from '@app/shared/types/user.types';

export const create_conversation = (
  id: string,
  name: string,
  type: conversation_type
) => {
  return db
    .insert(conversations)
    .values({
      id,
      name,
      type,
    })
    .returning();
};

export const delete_conversation = (conversationId: string) => {
  return db
    .delete(conversations)
    .where(sql`${conversations.id} = ${conversationId}`);
};

export const create_user_conversation = (
  conversationId: string,
  userId: string
) => {
  return db
    .insert(conversationParticipants)
    .values({
      conversation_id: conversationId,
      user_id: userId,
    })
    .returning();
};

export const update_last_message_id = (
  conversationId: string,
  messageId: string
) => {
  return db
    .update(conversations)
    .set({ last_message_id: messageId })
    .where(sql`${conversations.id} = ${conversationId}`);
};
