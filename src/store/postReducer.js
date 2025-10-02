import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { server } from '../BFF/bff';

// Асинхронные операции
export const loadPost = createAsyncThunk('post/loadPost', async (postID) => {
  const post = await server.fetchPost(postID);
  return post;
});

export const addComment = createAsyncThunk(
  'post/addComment',
  async (commentInfo, { getState, rejectWithValue }) => {
    const userSession = getState().user.session;
    const { error, response } = await server.addComment(userSession, commentInfo);

    if (error) return rejectWithValue(error);
    return response;
  }
);

export const deleteComment = createAsyncThunk(
  'post/deleteComment',
  async (commentid, { getState, rejectWithValue, dispatch }) => {
    const userSession = getState().user.session;
    const response = await server.removeComment(userSession, commentid);

    if (response.error) return rejectWithValue('Нет прав на удаление');

    const newCommentsState = getState().post.comments.filter(
      (comment) => commentid !== comment.id
    );

    dispatch({ type: 'app/closeModalWindow' });

    return newCommentsState;
  }
);

const postSlice = createSlice({
  name: 'post',
  initialState: {
    id: '',
    title: '',
    image_URL: '',
    content: '',
    published_at: '',
    comments: [],
    commentsErrors: null,
  },
  reducers: {
    addPost: (state, action) => {
      return state;
    },
    setPostData: (state, action) => {
      return state;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loadPost.fulfilled, (state, action) => ({
      ...state,
      ...action.payload.response,
    })),
      builder.addCase(addComment.fulfilled, (state, action) => {
        return {
          ...state,
          comments: [...state.comments, action.payload],
        };
      });
    builder.addCase(addComment.rejected, (state, action) => ({
      ...state,
      commentsErrors: action.payload,
    })),
      builder.addCase(deleteComment.fulfilled, (state, action) => ({
        ...state,
        comments: action.payload,
      }));
    builder.addCase(deleteComment.rejected, (state, action) => ({
      ...state,
      commentsErrors: action.payload,
    }));
  },
});

export const { reducer, actions } = postSlice;
