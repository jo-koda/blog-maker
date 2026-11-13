import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { Tag } from '@/models/tag'
import { TagsState } from './tags-state'

export const initialState: TagsState = {
  tags: [],
  loading: true,
  deleteTargetId: null,
  deleting: false,
}

export const tagsSlice = createSlice({
  name: 'tags',
  initialState,
  reducers: {
    tagsLoaded(state: TagsState, action: PayloadAction<Tag[]>) {
      return {
        ...state,
        tags: action.payload,
        loading: false,
      }
    },
    tagAdded(state: TagsState, action: PayloadAction<Tag>) {
      const exists = state.tags.some((tag) => tag.id === action.payload.id)
      return {
        ...state,
        tags: exists
          ? state.tags
          : [...state.tags, action.payload].sort((a, b) =>
              a.name.localeCompare(b.name),
            ),
      }
    },
    tagRemoved(state: TagsState, action: PayloadAction<string>) {
      return {
        ...state,
        tags: state.tags.filter((tag) => tag.id !== action.payload),
      }
    },
    deleteTargetChanged(
      state: TagsState,
      action: PayloadAction<string | null>,
    ) {
      return {
        ...state,
        deleteTargetId: action.payload,
      }
    },
    deletingChanged(state: TagsState, action: PayloadAction<boolean>) {
      return {
        ...state,
        deleting: action.payload,
      }
    },
  },
})

export default tagsSlice.reducer
