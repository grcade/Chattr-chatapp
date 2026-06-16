export type user_status = 'online' | 'offline' | 'away';

export interface User {
  id: string;
  username: string;
  avatarUrl?: string;
  status: user_status;
  created_at: Date;
}

export type conversation_type = 'private' | 'group';

export interface Conversation {
  id: string;
  name: string;
  type: conversation_type;
  created_at: Date;
  updated_at: Date;
  last_message_id: string | null;
}

export interface Chat {
  id: string;
  message: string;
  created_at: Date;
  sender_username: string;
  conversation_id: string;
  image_url?: string | null;
  status: message_status;
  is_deleted: boolean;
  attachment_url?: string | null;
}

export type message_status = 'sent' | 'delivered' | 'read';
