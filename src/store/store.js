import { configureStore } from '@reduxjs/toolkit';
import { reducer as postReducer } from './postReducer';
import { reducer as postsReducer } from './postsReducer';
import { reducer as userReducer } from './userReducer';
import { reducer as usersReducer } from './usersReducer';
import { reducer as appReducer } from './appReducer';

let test = 'test';

export const store = configureStore({
  reducer: {
    user: userReducer,
    users: usersReducer,
    post: postReducer,
    posts: postsReducer,
    app: appReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ thunk: { extraArgument: { test } } }),
});
