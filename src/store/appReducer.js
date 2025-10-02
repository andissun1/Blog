import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  wasLogout: false,
  modal: { isOpen: false },
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    logout: (state, action) => {
      state.wasLogout = !state.wasLogout;
    },
    openModalWindow: (state, action) => {
      state.modal = { ...action.payload, isOpen: true };
    },
    closeModalWindow: (state) => {
      state.modal = initialState.modal;
    },
  },
});

export const { reducer, actions } = appSlice;
