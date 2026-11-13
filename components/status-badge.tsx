import { STATUS_LABEL } from '@/lib/blog/constants'
import { PostStatus } from '@/models/post'

const STATUS_CLASS: Record<PostStatus, string> = {
  DRAFT: 'bg-(--status-draft-tint) text-(--status-draft)',
  SCHEDULED: 'bg-(--status-scheduled-tint) text-(--status-scheduled)',
  PUBLISHED: 'bg-(--status-published-tint) text-(--status-published)',
  ARCHIVED: 'bg-(--status-archived-tint) text-(--status-archived)',
}

export function StatusBadge({ status }: { status: PostStatus }) {
  return (
    <span
      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_CLASS[status]}`}
    >
      {STATUS_LABEL[status]}
    </span>
  )
}
