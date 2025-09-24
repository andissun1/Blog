import { createSlice } from '@reduxjs/toolkit';

const usersSlice = createSlice({
  name: 'users',
  initialState: {},
  reducers: {
    addPost: (state, action) => {
      return state;
    },
  },
});

export const { reducer, actions } = usersSlice;
