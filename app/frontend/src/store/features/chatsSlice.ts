import { createSlice } from '@reduxjs/toolkit';

const initialState: {
  conversationId: string | null;
  username: string | null;
  chats: unknown[];
} = {
  conversationId: null,
  username: null,
  chats: [],
};

const chatsSlice = createSlice({
  name: 'chats',
  initialState,
  reducers: {
    setChats: (state, action) => {
      state.conversationId = action.payload.conversationId;
      state.chats = action.payload.chats;
      state.username = action.payload.username;
    },
    clearChats: (state) => {
      state.conversationId = null;
      state.chats = [];
      state.username = null;
    },
  },
});

export const { setChats, clearChats } = chatsSlice.actions;
export default chatsSlice.reducer;
