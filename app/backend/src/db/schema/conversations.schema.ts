import {
  pgTable,
  uuid,
  varchar,
  pgEnum,
  type AnyPgColumn,
  index,
} from 'drizzle-orm/pg-core';
import { timestamps } from '../../utils/timestamps';
import { users } from './user.schema';
import { chats } from './chat.schema';

export const conversation_type_enum = pgEnum('conversation_type', [
  'private',
  'group',
]);

export const conversations = pgTable(
  'conversations',
  {
    id: uuid('id').primaryKey().notNull(),
    name: varchar('name', { length: 255 }).notNull(),
    type: conversation_type_enum('type').default('private').notNull(),
    last_message_id: uuid('last_message_id').references(
      (): AnyPgColumn => chats.id,
      { onDelete: 'set null' }
    ),
    ...timestamps,
  },
  (table) => {
    return {
      nameIndex: index('name_index').on(table.name),
    };
  }
);
