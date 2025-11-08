import { configureStore } from '@reduxjs/toolkit';
import { reducer as postReducer } from './postReducer';
import { reducer as userReducer } from './userReducer';
import { reducer as appReducer } from './appReducer';

let test = 'test';

export const store = configureStore({
  reducer: {
    user: userReducer,
    post: postReducer,
    app: appReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ thunk: { extraArgument: { test } } }),
});
