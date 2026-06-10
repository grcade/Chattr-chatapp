import {
  //add validation and all here later
  create_conversation,
  delete_conversation,
  create_user_conversation,
  update_last_message_id,
  toggle_conversation_active_status,
  get_all_conversations,
} from '../repo/conversation.repo';
import type { conversation_type } from '@app/shared/types/user.types';
import crypto from 'crypto';

export const createConversationService = (type: conversation_type) => {
  const uuid: string = crypto.randomUUID();

  return create_conversation(uuid, type);
};

export const toggleConversationActiveStatusService = (
  conversationId: string,
  isActive: boolean
) => {
  return toggle_conversation_active_status(conversationId, isActive);
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

export const getAllConversationsService = (userId: string) => {
  return get_all_conversations(userId);
};
