import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { PostSummary } from '@/models/post'
import { PostStatusFilter, PostsState } from './posts-state'

export const initialState: PostsState = {
  posts: [],
  loading: true,
  searchTerm: '',
  statusFilter: 'ALL',
  page: 1,
  busyPostId: null,
  deleteTargetId: null,
}

export const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    postsLoaded(state: PostsState, action: PayloadAction<PostSummary[]>) {
      return {
        ...state,
        posts: action.payload,
        loading: false,
      }
    },
    postPatched(state: PostsState, action: PayloadAction<PostSummary>) {
      return {
        ...state,
        posts: state.posts.map((post) =>
          post.id === action.payload.id ? action.payload : post,
        ),
      }
    },
    postRemoved(state: PostsState, action: PayloadAction<string>) {
      return {
        ...state,
        posts: state.posts.filter((post) => post.id !== action.payload),
      }
    },
    searchTermChanged(state: PostsState, action: PayloadAction<string>) {
      return {
        ...state,
        searchTerm: action.payload,
        page: 1,
      }
    },
    statusFilterChanged(
      state: PostsState,
      action: PayloadAction<PostStatusFilter>,
    ) {
      return {
        ...state,
        statusFilter: action.payload,
        page: 1,
      }
    },
    pageChanged(state: PostsState, action: PayloadAction<number>) {
      return {
        ...state,
        page: action.payload,
      }
    },
    busyPostChanged(state: PostsState, action: PayloadAction<string | null>) {
      return {
        ...state,
        busyPostId: action.payload,
      }
    },
    deleteTargetChanged(
      state: PostsState,
      action: PayloadAction<string | null>,
    ) {
      return {
        ...state,
        deleteTargetId: action.payload,
      }
    },
  },
})

export default postsSlice.reducer
