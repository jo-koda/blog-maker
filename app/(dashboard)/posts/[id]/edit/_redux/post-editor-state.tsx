import { Category } from '@/models/category'
import { PostStatus, PostValues } from '@/models/post'
import { Tag } from '@/models/tag'

export type PostEditorValues = Omit<PostValues, 'scheduledAt'> & {
  scheduledAt: string
}

export type SaveStatus = 'idle' | 'dirty' | 'saving' | 'saved' | 'error'

export interface PostEditorState {
  loaded: boolean
  postId: string | null
  persistedSlug: string | null
  persistedStatus: PostStatus | null
  values: PostEditorValues
  slugTouched: boolean
  categories: Category[]
  tags: Tag[]
  saveStatus: SaveStatus
  savingIntent: PostStatus | null
  savedAt: string | null
  revision: number
  errors: Record<string, string>
}
