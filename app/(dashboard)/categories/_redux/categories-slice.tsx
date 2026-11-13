import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { Category } from '@/models/category'
import { CategoriesState } from './categories-state'

export const initialState: CategoriesState = {
  categories: [],
  loading: true,
  deleteTargetId: null,
  deleting: false,
}

export const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    categoriesLoaded(
      state: CategoriesState,
      action: PayloadAction<Category[]>,
    ) {
      return {
        ...state,
        categories: action.payload,
        loading: false,
      }
    },
    categoryAdded(state: CategoriesState, action: PayloadAction<Category>) {
      return {
        ...state,
        categories: [...state.categories, action.payload].sort((a, b) =>
          a.name.localeCompare(b.name),
        ),
      }
    },
    deleteTargetChanged(
      state: CategoriesState,
      action: PayloadAction<string | null>,
    ) {
      return {
        ...state,
        deleteTargetId: action.payload,
      }
    },
    deletingChanged(state: CategoriesState, action: PayloadAction<boolean>) {
      return {
        ...state,
        deleting: action.payload,
      }
    },
  },
})

export default categoriesSlice.reducer
