import 'server-only'

import { TagRecord, cuid, db } from '@/lib/mock/db'

export async function index() {
  return db.tags
    .map((tag) => ({
      ...tag,
      _count: {
        posts: db.postTags.filter((link) => link.tagId === tag.id).length,
      },
    }))
    .sort((a, b) => a.name.localeCompare(b.name))
}

export async function showBySlug({ slug }: { slug: string }) {
  return db.tags.find((tag) => tag.slug === slug) ?? null
}

export async function store({ data }: { data: Omit<TagRecord, 'id'> }) {
  const tag: TagRecord = { ...data, id: cuid() }
  db.tags.push(tag)
  return { ...tag, _count: { posts: 0 } }
}

export async function destroy({ id }: { id: string }) {
  db.tags = db.tags.filter((tag) => tag.id !== id)
  db.postTags = db.postTags.filter((link) => link.tagId !== id)
}
