import { configureStore } from '@reduxjs/toolkit';
import { reducer as postReducer } from './postReducer';
import { reducer as postsReducer } from './postsReducer';
import { reducer as userReducer } from './userReducer';
import { reducer as usersReducer } from './usersReducer';

export const store = configureStore({
  reducer: {
    user: userReducer,
    users: usersReducer,
    post: postReducer,
    posts: postsReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});
