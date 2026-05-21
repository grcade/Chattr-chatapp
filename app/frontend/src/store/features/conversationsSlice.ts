import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface ConversationItem {
  id: string;
  username: string;
  joinedAt: number;
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
        joinedAt?: number;
      }>
    ) => {
      const username = action.payload.username.trim();
      if (!username) return;

      const existing = state.list.find((c) => c.username === username);
      if (existing) return;

      const conversation: ConversationItem = {
        id: action.payload.id ?? `${username}-${Date.now()}`,
        username,
        joinedAt: action.payload.joinedAt ?? Date.now(),
      };

      state.list.unshift(conversation);
      if (!state.activeConversationId) {
        state.activeConversationId = conversation.id;
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
