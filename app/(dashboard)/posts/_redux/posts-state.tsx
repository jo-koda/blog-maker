import { PostStatus, PostSummary } from '@/models/post'

export type PostStatusFilter = 'ALL' | PostStatus

export interface PostsState {
  posts: PostSummary[]
  loading: boolean
  searchTerm: string
  statusFilter: PostStatusFilter
  page: number
  busyPostId: string | null
  deleteTargetId: string | null
}
