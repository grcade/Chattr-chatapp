import {
  create_conversation,
  delete_conversation,
  create_user_conversation,
  update_last_message_id,
} from '../repo/conversation.repo';
import type { conversation_type } from '@app/shared/types/user.types';
import crypto from 'crypto';

export const createConversationService = (
  name: string,
  type: conversation_type
) => {
  const uuid: string = crypto.randomUUID();

  return create_conversation(uuid, name.trim(), type);
};

export const deleteConversationService = (conversationId: string) => {
  return delete_conversation(conversationId);
};

export const addUserToConversationService = (
  conversationId: string,
  userId: string
) => {
  return create_user_conversation(conversationId, userId);
};

export const updateLastMessageIdService = (
  conversationId: string,
  messageId: string
) => {
  return update_last_message_id(conversationId, messageId);
};
