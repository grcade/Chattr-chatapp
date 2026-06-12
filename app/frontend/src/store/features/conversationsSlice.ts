import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface ConversationItem {
 conversationId: string;
  id: string;
  username: string;
  userId?: string;
  joinedAt: number;
  avatarUrl?: string | null;
}

interface ConversationsState {
  list: ConversationItem[];
  activeConversationId: string | null;
}

const initialState: ConversationsState = {
  list: [],
  activeConversationId: null,
};

const conversationsSlice = createSlice({
  name: 'conversations',
  initialState,
  reducers: {
    upsertConversation: (
      state,
      action: PayloadAction<{
        username: string;
        id?: string;
        conversationId?: string;
        joinedAt?: number;
        avatarUrl?: string | null;
      }>
    ) => {
      const username = action.payload.username.trim();
      if (!username) return;

      const existing = state.list.find((c) => c.username === username);
      if (existing) {
        const nextId = action.payload.conversationId?.trim();

        if (nextId && existing.conversationId !== nextId) {
          const wasActive = state.activeConversationId === existing.conversationId;
          existing.conversationId = nextId;

          if (wasActive) {
            state.activeConversationId = nextId;
          }
        }

        if (typeof action.payload.joinedAt === 'number') {
          existing.joinedAt = action.payload.joinedAt;
        }

        return;
      }

      const conversation: ConversationItem = {
        conversationId: action.payload.conversationId ?? `${username}-${Date.now()}`,
        id: action.payload.id ?? `${username}-${Date.now()}`,
        username,
        joinedAt: action.payload.joinedAt ?? Date.now(),
        avatarUrl: action.payload.avatarUrl,
      };

      state.list.unshift(conversation);
      if (!state.activeConversationId) {
        state.activeConversationId = conversation.conversationId;
      }
    },

    setActiveConversation: (state, action: PayloadAction<string>) => {
      state.activeConversationId = action.payload;
    },

    clearConversations: (state) => {
      state.list = [];
      state.activeConversationId = null;
    },
  },
});

export const { upsertConversation, setActiveConversation, clearConversations } =
  conversationsSlice.actions;
export default conversationsSlice.reducer;
