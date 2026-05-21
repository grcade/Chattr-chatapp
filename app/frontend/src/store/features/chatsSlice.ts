import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  chats: [],
};

const chatsSlice = createSlice({
  name: 'chats',
  initialState,
  reducers: {
    setChats: (state, action) => {
      state.user = action.payload.user;
      state.chats = action.payload.chats;
    },
    clearChats: (state) => {
      state.user = null;
      state.chats = [];
    },
  },
});

export const { setChats, clearChats } = chatsSlice.actions;
export default chatsSlice.reducer;
