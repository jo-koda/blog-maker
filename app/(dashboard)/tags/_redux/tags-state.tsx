import { Tag } from '@/models/tag'

export interface TagsState {
  tags: Tag[]
  loading: boolean
  deleteTargetId: string | null
  deleting: boolean
}
