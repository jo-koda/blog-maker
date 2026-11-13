import { configureStore } from '@reduxjs/toolkit'

import postsSlice from './app/(dashboard)/posts/_redux/posts-slice'
import postEditorSlice from './app/(dashboard)/posts/[id]/edit/_redux/post-editor-slice'
import categoriesSlice from './app/(dashboard)/categories/_redux/categories-slice'
import tagsSlice from './app/(dashboard)/tags/_redux/tags-slice'

export const store = configureStore({
  reducer: {
    postsState: postsSlice,
    postEditorState: postEditorSlice,
    categoriesState: categoriesSlice,
    tagsState: tagsSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {},
    }),
})

export type AppDispatch = typeof store.dispatch
export type GetState = typeof store.getState
export type RootState = ReturnType<typeof store.getState>
