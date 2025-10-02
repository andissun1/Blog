import { createSlice } from '@reduxjs/toolkit';
import { ROLES, server } from '../BFF/bff';

const initialState = {
  id: null,
  login: null,
  role_id: ROLES.anonim,
  session: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setSession: (state, action) => {
      return { ...state, ...action.payload };
    },
    logout(state, action) {
      server.logout(action.payload);
      sessionStorage.clear();
      return initialState;
    },
  },
});

export const { reducer, actions } = userSlice;
