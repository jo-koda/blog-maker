import { ADMIN_PAGE_SIZE, POST_STATUSES } from '@/lib/blog/constants'
import { PostStatus, PostSummary } from '@/models/post'
import { PostStatusFilter } from './posts-state'

export function visiblePosts({
  posts,
  searchTerm,
  statusFilter,
}: {
  posts: PostSummary[]
  searchTerm: string
  statusFilter: PostStatusFilter
}) {
  const term = searchTerm.trim().toLowerCase()

  return posts.filter((post) => {
    if (statusFilter !== 'ALL' && post.status !== statusFilter) return false
    if (!term) return true
    return [
      post.title,
      post.slug,
      post.author.name,
      post.category?.name ?? '',
      ...post.tags.map((tag) => tag.name),
    ]
      .join(' ')
      .toLowerCase()
      .includes(term)
  })
}

export function statusCounts(posts: PostSummary[]) {
  const counts = Object.fromEntries(
    POST_STATUSES.map((status) => [status, 0]),
  ) as Record<PostStatus, number>
  for (const post of posts) counts[post.status] += 1
  return { ALL: posts.length, ...counts }
}

export function postDate(post: PostSummary) {
  if (post.status === 'PUBLISHED') {
    return { label: 'Published', iso: post.publishedAt }
  }
  if (post.status === 'SCHEDULED') {
    return { label: 'Scheduled', iso: post.scheduledAt }
  }
  return { label: 'Last modified', iso: post.updatedAt }
}

export function paginate<T>(list: T[], page: number) {
  const totalPages = Math.max(1, Math.ceil(list.length / ADMIN_PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const start = (currentPage - 1) * ADMIN_PAGE_SIZE

  return {
    items: list.slice(start, start + ADMIN_PAGE_SIZE),
    total: list.length,
    totalPages,
    currentPage,
    start,
    end: Math.min(start + ADMIN_PAGE_SIZE, list.length),
  }
}
