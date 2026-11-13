import 'server-only'

import { revalidatePath } from 'next/cache'
import { indexDueScheduled, updateStatus } from '@/services/post-service'

// Kept out of the server actions on purpose: it runs without a session and is
// only reachable through the CRON_SECRET-protected route handler.
export async function publishDuePosts() {
  const due = await indexDueScheduled({ now: new Date() })

  for (const post of due) {
    await updateStatus({
      id: post.id,
      status: 'PUBLISHED',
      publishedAt: post.scheduledAt,
    })
  }

  if (due.length > 0) {
    revalidatePath('/blog', 'layout')
    revalidatePath('/posts')
  }

  return due.map(({ slug }) => slug)
}
