import { configureStore } from '@reduxjs/toolkit';
import userReducer from './features/userSlice';
import conversationsReducer from './features/conversationsSlice';
import chatsReducer from './features/chatsSlice';
import chatRequestsReducer from './features/chatRequestsSlice';

const Store = configureStore({
  reducer: {
    user: userReducer,
    conversations: conversationsReducer,
    chats: chatsReducer,
    chatRequests: chatRequestsReducer,
  },
});

export type RootState = ReturnType<typeof Store.getState>;
export type AppDispatch = typeof Store.dispatch;
export default Store;
