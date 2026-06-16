import { sql, ilike, eq, aliasedTable, ne, and } from 'drizzle-orm';
import db from '../db/db.js';
import {
  conversations,
  conversationParticipants,
  users,
} from '../db/schema/index.js';
import type { conversation_type } from '@app/shared/types/user.types';


export const create_conversation = (id: string, type: conversation_type) => {
  return db
    .insert(conversations)
    .values({
      id,
      type,
    })
    .returning();
};

export const toggle_conversation_active_status = (
  conversationId: string,
  isActive: boolean
) => {
  return db
    .update(conversations)
    .set({ is_active: isActive })
    .where(sql`${conversations.id} = ${conversationId}`);
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

export const get_all_conversations = (userId: string) => {
  const otherParticipants = aliasedTable(
    conversationParticipants,
    'other_participants'
  );

  // doing a self join + a inner join with users table to get credetionslss
  const getConversationPrepared = db
    .select({
      conversationId: conversationParticipants.conversation_id,
      id: users.id,
      name: users.username,
      avatarUrl: users.avatarUrl,
    })
    .from(conversationParticipants)
    .innerJoin(
      otherParticipants,
      eq(
        conversationParticipants.conversation_id,
        otherParticipants.conversation_id
      )
    )
    .innerJoin(users, eq(otherParticipants.user_id, users.id))
    .where(
      and(
        eq(conversationParticipants.user_id, sql.placeholder('currentUserId')),
        ne(otherParticipants.user_id, sql.placeholder('currentUserId'))
      )
    )
    .prepare('get_all_conversations');

  return getConversationPrepared.execute({ currentUserId: userId });
};
