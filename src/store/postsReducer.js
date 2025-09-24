import { createSlice } from '@reduxjs/toolkit';

const postsSlice = createSlice({
  name: 'posts',
  initialState: {},
  reducers: {
    addPost: (state, action) => {
      return state;
    },
  },
});

export const { reducer, actions } = postsSlice;
