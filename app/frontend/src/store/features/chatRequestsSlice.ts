import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export type JoinRequestStatus = 'pending' | 'accepted' | 'rejected';

export interface ChatJoinRequest {
  id: string;
  from: string;
  to: string;
  status: JoinRequestStatus;
  createdAt: number;
  updatedAt: number;
  conversationId?: string;
  privateChatId?: string;
}

export type ChatJoinResponse = ChatJoinRequest & {
  status: 'accepted' | 'rejected';
};

interface ChatRequestsState {
  sent: ChatJoinRequest[];
  inbox: ChatJoinRequest[];
}

const initialState: ChatRequestsState = {
  sent: [],
  inbox: [],
};

const chatRequestsSlice = createSlice({
  name: 'chatRequests',
  initialState,
  reducers: {
    sendJoinRequest: (state, action: PayloadAction<ChatJoinRequest>) => {
      state.sent.unshift(action.payload);
    },

    recieveJoinRequest: (state, action: PayloadAction<ChatJoinRequest>) => {
      state.inbox.unshift(action.payload);
    },

    setInboxRequestStatus: (
      state,
      action: PayloadAction<{
        id: string;
        status: Exclude<JoinRequestStatus, 'pending'>;
        conversationId?: string;
        privateChatId?: string;
      }>
    ) => {
      const now = Date.now();
      const conversationId =
        action.payload.conversationId ?? action.payload.privateChatId;

      state.inbox = state.inbox.map((req) =>
        req.id === action.payload.id
          ? {
              ...req,
              status: action.payload.status,
              conversationId: conversationId ?? req.conversationId,
              privateChatId: action.payload.privateChatId ?? req.privateChatId,
              updatedAt: now,
            }
          : req
      );

      state.sent = state.sent.map((req) =>
        req.id === action.payload.id
          ? {
              ...req,
              status: action.payload.status,
              conversationId: conversationId ?? req.conversationId,
              privateChatId: action.payload.privateChatId ?? req.privateChatId,
              updatedAt: now,
            }
          : req
      );
    },
  },
});

export const { sendJoinRequest, setInboxRequestStatus, recieveJoinRequest } =
  chatRequestsSlice.actions;
export default chatRequestsSlice.reducer;
