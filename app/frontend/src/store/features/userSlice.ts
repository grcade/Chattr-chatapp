import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface UserState {
  id: string | null;
  username: string | null;
  status: 'online' | 'offline' | 'away';
}

const intitialState: UserState = {
  id: null,
  username: null,
  status: 'offline',
};

const userSlice = createSlice({
  name: 'user',
  initialState: intitialState,
  reducers: {
    setUser: (state, action: PayloadAction<{ username: string }>) => {
      state.username = action.payload.username;
    },
    setStatus: (
      state,
      action: PayloadAction<'online' | 'offline' | 'away'>
    ) => {
      state.status = action.payload;
    },
    clearUser: (state: UserState) => {
      state.id = null;
      state.username = null;
      state.status = 'offline';
    },
  },
});

export const { setUser, setStatus, clearUser } = userSlice.actions;
export default userSlice.reducer;
