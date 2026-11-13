import { PostStatus } from '@/models/post'

export const STATUS_LABEL: Record<PostStatus, string> = {
  DRAFT: 'Draft',
  SCHEDULED: 'Scheduled',
  PUBLISHED: 'Published',
  ARCHIVED: 'Archived',
}

export const POST_STATUSES = Object.keys(STATUS_LABEL) as PostStatus[]

export const ADMIN_PAGE_SIZE = 10
export const BLOG_PAGE_SIZE = 10
export const AUTOSAVE_DELAY_MS = 3000
export const MAX_REVISIONS = 20
export const WORDS_PER_MINUTE = 220

export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024
export const UPLOAD_IMAGE_TYPES: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
  'image/avif': 'avif',
}
