import { createSlice } from '@reduxjs/toolkit';

const postSlice = createSlice({
  name: 'post',
  initialState: {},
  reducers: {
    addPost: (state, action) => {
      return state;
    },
  },
});

export const { reducer, actions } = postSlice;
