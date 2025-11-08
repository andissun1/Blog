import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { request } from '../utils/request';

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
    const { data } = await request(`/posts/${postID}`);

    if (!data) {
      rejectWithValue(post.error);
      return;
    }

    return data;
  }
);

export const addComment = createAsyncThunk(
  'post/addComment',
  async (commentInfo, { rejectWithValue }) => {
    const { data } = await request(`/posts/${commentInfo.post_Id}/comments`, 'POST', {
      content: commentInfo.content,
    });

    if (!data) {
      rejectWithValue(error);
      return;
    }

    return data;
  }
);

export const savePost = createAsyncThunk(
  'post/savePost',
  async (postInfo, { rejectWithValue }) => {
    const postInfoWithoutId = { ...postInfo };
    delete postInfoWithoutId.id;
    const saveRequest = postInfo.id
      ? request(`/posts/${postInfo.id}`, 'PATCH', postInfo)
      : request(`/posts/`, 'POST', postInfoWithoutId);

    const { data } = await saveRequest;
    if (!data) return rejectWithValue('Ошибка при создании поста');

    return data;
  }
);

export const deletePost = createAsyncThunk(
  'post/deletePost',
  async (postID, { rejectWithValue, dispatch }) => {
    const { error } = await request(`/posts/${postID}`, 'DELETE');

    if (error) return rejectWithValue('Нет прав на удаление');

    dispatch({ type: 'app/closeModalWindow' });
  }
);

export const deleteComment = createAsyncThunk(
  'post/deleteComment',
  async (commentid, { getState, rejectWithValue, dispatch }) => {
    const { error } = await request(
      `/posts/${getState().post.id}/comments/${commentid}`,
      'DELETE'
    );

    if (error) return rejectWithValue('Нет прав на удаление');

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
    builder.addCase(loadPost.fulfilled, (state, action) => {
      return {
        ...state,
        ...action.payload,
      };
    }),
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
