import { pgTable } from 'drizzle-orm/pg-core/table';

import { uuid, timestamp, primaryKey, pgEnum } from 'drizzle-orm/pg-core';
import { conversations } from './conversations.schema';
import { users } from './user.schema';

export const user_role_enum = pgEnum('user_role', ['user', 'admin']);

export const conversationParticipants = pgTable(
  'conversation_participants',
  {
    conversation_id: uuid('conversation_id')
      .references(() => conversations.id, {
        onDelete: 'cascade',
      })
      .notNull(),

    user_id: uuid('user_id')
      .references(() => users.id, {
        onDelete: 'cascade',
      })
      .notNull(),

    role: user_role_enum('role').default('user').notNull(),

    joined_at: timestamp('joined_at').defaultNow(),
  },
  (table) => ({
    pk: primaryKey({
      columns: [table.conversation_id, table.user_id],
    }),
  })
);
