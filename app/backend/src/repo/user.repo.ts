import { sql, ilike } from 'drizzle-orm';
import db from '../db/db.js';
import { users } from '../db/schema/index.js';
import crypto from 'crypto';
import type { user_status } from '@app/shared/types/user.types';

export const search_users = (keyword: string) => {
  return db
    .select()
    .from(users)
    .where(ilike(users.username, `${keyword}%`));
};

export const upsert_user = (username: string) => {
  const uuid: string = crypto.randomUUID();
  console.log('Upserting user with username: ', username);
  console.log('Generated UUID: ', uuid);

  return db
    .insert(users)
    .values({ username, id: uuid })
    .onConflictDoUpdate({ target: users.username, set: { username } })
    .returning();
};

export const update_user_status = (userId: string, status: user_status) => {
  return db
    .update(users)
    .set({ status })
    .where(sql`${users.id} = ${userId}`);
};
