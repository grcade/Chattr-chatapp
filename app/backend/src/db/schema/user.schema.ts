import { pgTable, varchar, integer, uuid, pgEnum } from 'drizzle-orm/pg-core';
import { timestamps } from '../../utils/timestamps';

export const user_status_enum = pgEnum('user_status', [
  'online',
  'offline',
  'away',
]);

export const users = pgTable('users', {
  id: uuid('id').primaryKey(),
  username: varchar('username', { length: 255 }).notNull().unique(),
  password: varchar('password', { length: 255 }),
  avatarUrl: varchar('avatar_url', { length: 255 }),
  status: user_status_enum('status').default('offline'),
  created_at: timestamps.created_at,
});
