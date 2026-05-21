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
}

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
      }>
    ) => {
      const now = Date.now();

      state.inbox = state.inbox.map((req) =>
        req.id === action.payload.id
          ? { ...req, status: action.payload.status, updatedAt: now }
          : req
      );

      state.sent = state.sent.map((req) =>
        req.id === action.payload.id
          ? { ...req, status: action.payload.status, updatedAt: now }
          : req
      );
    },
  },
});

export const { sendJoinRequest, setInboxRequestStatus, recieveJoinRequest } =
  chatRequestsSlice.actions;
export default chatRequestsSlice.reducer;
