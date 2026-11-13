import 'server-only'

import {
  CategoryRecord,
  MediaRecord,
  PostRecord,
  TagRecord,
  UserRecord,
  cuid,
  db,
} from '@/lib/mock/db'
import { PostStatus } from '@/models/post'

export type PostWithRelations = PostRecord & {
  author: UserRecord
  category: CategoryRecord | null
  tags: { tag: TagRecord }[]
  coverImage: MediaRecord | null
}

export type PostData = Omit<PostRecord, 'id' | 'createdAt' | 'updatedAt'>

function withRelations(post: PostRecord): PostWithRelations {
  return {
    ...post,
    author: db.users.find((user) => user.id === post.authorId)!,
    category:
      db.categories.find((category) => category.id === post.categoryId) ?? null,
    tags: db.postTags
      .filter((link) => link.postId === post.id)
      .map((link) => ({ tag: db.tags.find((tag) => tag.id === link.tagId)! }))
      .filter(({ tag }) => tag),
    coverImage:
      db.media.find((media) => media.id === post.coverImageId) ?? null,
  }
}

function setTags(postId: string, tagIds: string[]) {
  db.postTags = db.postTags.filter((link) => link.postId !== postId)
  db.postTags.push(...tagIds.map((tagId) => ({ postId, tagId })))
}

export async function index({ authorId }: { authorId?: string } = {}) {
  return db.posts
    .filter((post) => !authorId || post.authorId === authorId)
    .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
    .map(withRelations)
}

export async function indexPublished() {
  return db.posts
    .filter((post) => post.status === 'PUBLISHED')
    .sort(
      (a, b) =>
        (b.publishedAt?.getTime() ?? 0) - (a.publishedAt?.getTime() ?? 0),
    )
    .map(withRelations)
}

export async function indexDueScheduled({ now }: { now: Date }) {
  return db.posts.filter(
    (post) =>
      post.status === 'SCHEDULED' &&
      post.scheduledAt !== null &&
      post.scheduledAt <= now,
  )
}

export async function show({ id }: { id: string }) {
  const post = db.posts.find((post) => post.id === id)
  return post ? withRelations(post) : null
}

export async function showBySlug({ slug }: { slug: string }) {
  const post = db.posts.find((post) => post.slug === slug)
  return post ? withRelations(post) : null
}

export async function showRedirect({ slug }: { slug: string }) {
  return db.slugRedirects.find((redirect) => redirect.oldSlug === slug) ?? null
}

export async function slugTaken({
  slug,
  ignoreId,
}: {
  slug: string
  ignoreId?: string
}) {
  return db.posts.some((post) => post.slug === slug && post.id !== ignoreId)
}

export async function store({
  data,
  tagIds,
}: {
  data: PostData
  tagIds: string[]
}) {
  const now = new Date()
  const post: PostRecord = {
    ...data,
    id: cuid(),
    createdAt: now,
    updatedAt: now,
  }
  db.posts.push(post)
  setTags(post.id, tagIds)
  return withRelations(post)
}

export async function update({
  id,
  data,
  tagIds,
}: {
  id: string
  data: Partial<PostData>
  tagIds?: string[]
}) {
  const index = db.posts.findIndex((post) => post.id === id)
  if (index === -1) throw new Error('Post not found.')

  const previous = db.posts[index]
  const post: PostRecord = { ...previous, ...data, updatedAt: new Date() }
  db.posts[index] = post

  if (tagIds) setTags(id, tagIds)
  if (previous.slug !== post.slug) {
    db.slugRedirects = db.slugRedirects.filter(
      (redirect) => redirect.oldSlug !== post.slug,
    )
    db.slugRedirects.push({ oldSlug: previous.slug, postId: id })
  }

  return withRelations(post)
}

export async function updateStatus({
  id,
  status,
  publishedAt,
}: {
  id: string
  status: PostStatus
  publishedAt?: Date | null
}) {
  return update({
    id,
    data: publishedAt === undefined ? { status } : { status, publishedAt },
  })
}

export async function destroy({ id }: { id: string }) {
  db.posts = db.posts.filter((post) => post.id !== id)
  db.postTags = db.postTags.filter((link) => link.postId !== id)
  db.revisions = db.revisions.filter((revision) => revision.postId !== id)
  db.slugRedirects = db.slugRedirects.filter(
    (redirect) => redirect.postId !== id,
  )
}
