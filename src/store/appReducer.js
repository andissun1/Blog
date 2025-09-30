import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  wasLogout: false,
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    logout: (state, action) => {
      state.wasLogout = !state.wasLogout;
    },
  },
});

export const { reducer, actions } = appSlice;
