import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { toSlug } from '@/lib/blog/slug'
import { Category } from '@/models/category'
import { Post, PostStatus } from '@/models/post'
import { Tag } from '@/models/tag'
import {
  EMPTY_VALUES,
  slugFollowsTitle,
  valuesFromPost,
} from './post-editor-query'
import { PostEditorState, PostEditorValues } from './post-editor-state'

type ValueChange = {
  [K in keyof PostEditorValues]: { key: K; value: PostEditorValues[K] }
}[keyof PostEditorValues]

export const initialState: PostEditorState = {
  loaded: false,
  postId: null,
  persistedSlug: null,
  persistedStatus: null,
  values: EMPTY_VALUES,
  slugTouched: false,
  categories: [],
  tags: [],
  saveStatus: 'idle',
  savingIntent: null,
  savedAt: null,
  revision: 0,
  errors: {},
}

function edited(
  state: PostEditorState,
  values: PostEditorValues,
  field: string,
): PostEditorState {
  const errors = { ...state.errors }
  delete errors[field]
  return {
    ...state,
    values,
    errors,
    revision: state.revision + 1,
    saveStatus: state.saveStatus === 'saving' ? 'saving' : 'dirty',
  }
}

export const postEditorSlice = createSlice({
  name: 'postEditor',
  initialState,
  reducers: {
    editorLoaded(
      state: PostEditorState,
      action: PayloadAction<{
        post: Post | null
        categories: Category[]
        tags: Tag[]
      }>,
    ) {
      const { post, categories, tags } = action.payload
      return {
        ...initialState,
        loaded: true,
        postId: post?.id ?? null,
        persistedSlug: post?.slug ?? null,
        persistedStatus: post?.status ?? null,
        values: post ? valuesFromPost(post) : EMPTY_VALUES,
        slugTouched: post ? !slugFollowsTitle(post) : false,
        savedAt: post?.updatedAt ?? null,
        categories,
        tags,
      }
    },
    editorReset() {
      return initialState
    },
    titleChanged(state: PostEditorState, action: PayloadAction<string>) {
      const values = {
        ...state.values,
        title: action.payload,
        slug: state.slugTouched ? state.values.slug : toSlug(action.payload),
      }
      return edited(state, values, 'title')
    },
    slugChanged(state: PostEditorState, action: PayloadAction<string>) {
      const slug = action.payload.toLowerCase().replace(/\s+/g, '-')
      return {
        ...edited(state, { ...state.values, slug }, 'slug'),
        slugTouched: true,
      }
    },
    valueChanged(state: PostEditorState, action: PayloadAction<ValueChange>) {
      const { key, value } = action.payload
      return edited(state, { ...state.values, [key]: value }, key)
    },
    tagToggled(state: PostEditorState, action: PayloadAction<string>) {
      const selected = state.values.tagIds.includes(action.payload)
      const tagIds = selected
        ? state.values.tagIds.filter((id) => id !== action.payload)
        : [...state.values.tagIds, action.payload]
      return edited(state, { ...state.values, tagIds }, 'tagIds')
    },
    tagCreated(state: PostEditorState, action: PayloadAction<Tag>) {
      const tag = action.payload
      const tags = state.tags.some(({ id }) => id === tag.id)
        ? state.tags
        : [...state.tags, tag]
      const tagIds = state.values.tagIds.includes(tag.id)
        ? state.values.tagIds
        : [...state.values.tagIds, tag.id]
      return { ...edited(state, { ...state.values, tagIds }, 'tagIds'), tags }
    },
    saveStarted(state: PostEditorState, action: PayloadAction<PostStatus>) {
      return {
        ...state,
        saveStatus: 'saving',
        savingIntent: action.payload,
      }
    },
    saveSucceeded(
      state: PostEditorState,
      action: PayloadAction<{ post: Post; revision: number }>,
    ) {
      const { post, revision } = action.payload
      const unchanged = state.revision === revision
      return {
        ...state,
        postId: post.id,
        persistedSlug: post.slug,
        persistedStatus: post.status,
        values: unchanged ? { ...state.values, slug: post.slug } : state.values,
        slugTouched: state.slugTouched || post.status !== 'DRAFT',
        saveStatus: unchanged ? 'saved' : 'dirty',
        savingIntent: null,
        savedAt: post.updatedAt,
        errors: {},
      }
    },
    saveFailed(
      state: PostEditorState,
      action: PayloadAction<Record<string, string>>,
    ) {
      return {
        ...state,
        saveStatus: 'error',
        savingIntent: null,
        errors: action.payload,
      }
    },
  },
})

export default postEditorSlice.reducer
