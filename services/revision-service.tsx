import 'server-only'

import type { JSONContent } from '@tiptap/core'
import { MAX_REVISIONS } from '@/lib/blog/constants'
import { cuid, db } from '@/lib/mock/db'

export async function index({ postId }: { postId: string }) {
  return db.revisions
    .filter((revision) => revision.postId === postId)
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
}

export async function store({
  postId,
  title,
  contentJson,
}: {
  postId: string
  title: string
  contentJson: JSONContent
}) {
  db.revisions.push({
    id: cuid(),
    postId,
    title,
    contentJson,
    createdAt: new Date(),
  })

  const keep = new Set(
    (await index({ postId })).slice(0, MAX_REVISIONS).map(({ id }) => id),
  )
  db.revisions = db.revisions.filter(
    (revision) => revision.postId !== postId || keep.has(revision.id),
  )
}
