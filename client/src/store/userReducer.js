import { createSlice } from '@reduxjs/toolkit';
import { ROLES } from '../constants/roles';
import { request } from '../utils/request';

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
    logout(state) {
      request('/logout', 'POST');
      sessionStorage.clear();
      return initialState;
    },
  },
});

export const { reducer, actions } = userSlice;
