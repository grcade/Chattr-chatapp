import {
  search_users,
  upsert_user,
  update_user_status,
} from '../repo/user.repo';
import type { user_status } from '@app/shared/types/user.types';

export const searchUsersService = (query: string) => {
  query = query.trim();
  if (!query) {
    return [];
  }
  return search_users(query);
};

export const upsertUserService = async (username: string) => {
  username = username.trim();
  if (!username) {
    throw new Error('Username cannot be empty');
  }
  const result = await upsert_user(username);

  return result[0];
};

export const updateUserStatusService = (
  userId: string,
  status: user_status
) => {
  return update_user_status(userId, status);
};
