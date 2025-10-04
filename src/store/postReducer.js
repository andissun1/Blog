import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { server } from '../BFF/bff';

const initialState = {
  id: '',
  title: '',
  image_URL: '',
  content: '',
  published_at: '',
  comments: [],
  commentsErrors: null,
  postErrors: null,
};

// Асинхронные операции
export const loadPost = createAsyncThunk(
  'post/loadPost',
  async (postID, { rejectWithValue }) => {
    const post = await server.fetchPost(postID);

    if (post.error) return rejectWithValue(post.error);
    return post;
  }
);

export const addComment = createAsyncThunk(
  'post/addComment',
  async (commentInfo, { getState, rejectWithValue }) => {
    const userSession = getState().user.session;
    const { error, response } = await server.addComment(userSession, commentInfo);

    if (error) return rejectWithValue(error);
    return response;
  }
);

export const savePost = createAsyncThunk(
  'post/savePost',
  async (postInfo, { getState, rejectWithValue }) => {
    const userSession = getState().user.session;
    const { error, response } = await server.savePost(userSession, postInfo);

    if (error) return rejectWithValue(error);
    return response;
  }
);

export const deletePost = createAsyncThunk(
  'post/deletePost',
  async (postID, { getState, rejectWithValue, dispatch }) => {
    const userSession = getState().user.session;
    const response = await server.removePost(userSession, postID);

    if (response.error) return rejectWithValue('Нет прав на удаление');

    dispatch({ type: 'app/closeModalWindow' });
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
  initialState,
  reducers: {
    addPost: (state, action) => {
      return state;
    },
    setPostData: (state, action) => {
      return state;
    },
    resetPost: () => initialState,
  },
  extraReducers: (builder) => {
    builder.addCase(loadPost.fulfilled, (state, action) => ({
      ...state,
      ...action.payload.response,
    })),
      builder.addCase(loadPost.rejected, (state, action) => ({
        ...initialState,
        postErrors: action.payload,
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
    builder.addCase(savePost.fulfilled, (state, action) => ({
      ...state,
      ...action.payload,
    }));
    builder.addCase(deletePost.fulfilled, (state, action) => initialState);
  },
});

export const { reducer, actions } = postSlice;
