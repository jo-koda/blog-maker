'use server'

import { revalidatePath } from 'next/cache'
import { auth } from '@/auth'
import {
  destroy,
  index,
  indexPublished,
  show,
  showBySlug,
  showRedirect,
  slugTaken,
  store,
  update,
  updateStatus,
} from '@/services/post-service'
import { store as storeMedia } from '@/services/media-service'
import { store as storeRevision } from '@/services/revision-service'
import { NO_ACCESS_MESSAGE, canEditPost, canPublish } from '@/lib/blog/access'
import { BLOG_PAGE_SIZE } from '@/lib/blog/constants'
import { readingTime } from '@/lib/blog/content'
import { toPost, toPostSummary } from '@/lib/blog/mappers'
import { renderContent } from '@/lib/blog/render'
import { stripTags } from '@/lib/blog/sanitize'
import { uniqueSlug } from '@/lib/blog/slug'
import { validatePostValues } from '@/lib/blog/validation'
import { Post, PostStatus, PostSummary, PostValues } from '@/models/post'
import { Result } from '@/models/result'

const UNAUTHENTICATED: Result<never> = {
  statusCode: 401,
  message: 'Not authenticated.',
}

const FORBIDDEN: Result<never> = {
  statusCode: 403,
  message: NO_ACCESS_MESSAGE,
}

const NOT_FOUND: Result<never> = {
  statusCode: 404,
  message: 'Post not found.',
}

function revalidateBlog() {
  revalidatePath('/blog', 'layout')
  revalidatePath('/posts')
}

function emptyToNull(value: string) {
  const trimmed = value.trim()
  return trimmed ? trimmed : null
}

export async function getPosts(): Promise<Result<PostSummary[]>> {
  const session = await auth()
  if (!session) return UNAUTHENTICATED

  const authorId = canPublish(session.user.role) ? undefined : session.user.id

  try {
    const posts = await index({ authorId })
    return { data: posts.map(toPostSummary), statusCode: 200 }
  } catch {
    return { statusCode: 500, message: 'Could not load posts.' }
  }
}

export async function getPost({ id }: { id: string }): Promise<Result<Post>> {
  const session = await auth()
  if (!session) return UNAUTHENTICATED

  try {
    const post = await show({ id })
    if (!post) return NOT_FOUND
    if (!canEditPost(session.user, post)) return FORBIDDEN
    return { data: toPost(post), statusCode: 200 }
  } catch {
    return { statusCode: 500, message: 'Could not load post.' }
  }
}

export async function savePost({
  id,
  values,
  status,
  autosave = false,
}: {
  id: string | null
  values: PostValues
  status: PostStatus
  autosave?: boolean
}): Promise<Result<Post>> {
  const session = await auth()
  if (!session) return UNAUTHENTICATED

  const existing = id ? await show({ id }) : null
  if (id && !existing) return NOT_FOUND
  if (existing && !canEditPost(session.user, existing)) return FORBIDDEN

  const nextStatus = autosave ? 'DRAFT' : status
  if (autosave && existing && existing.status !== 'DRAFT') {
    return { statusCode: 409, message: 'Only drafts autosave.' }
  }
  if (
    (nextStatus === 'PUBLISHED' || nextStatus === 'SCHEDULED') &&
    !canPublish(session.user.role)
  ) {
    return FORBIDDEN
  }

  const errors = validatePostValues(values, nextStatus)
  if (Object.keys(errors).length > 0) {
    return { statusCode: 422, message: Object.values(errors)[0], errors }
  }

  try {
    const title = values.title.trim()
    const slug = await uniqueSlug(values.slug || title, (candidate) =>
      slugTaken({ slug: candidate, ignoreId: existing?.id }),
    )

    let coverImageId: string | null = null
    if (values.coverImageUrl) {
      const current = existing?.coverImage
      coverImageId =
        current &&
        current.url === values.coverImageUrl &&
        current.alt === values.coverImageAlt.trim()
          ? current.id
          : (
              await storeMedia({
                url: values.coverImageUrl,
                alt: values.coverImageAlt.trim(),
              })
            ).id
    }

    const data = {
      slug,
      title,
      excerpt: emptyToNull(stripTags(values.excerpt)),
      contentJson: values.contentJson,
      contentHtml: renderContent(values.contentJson),
      readingTime: readingTime(values.contentJson),
      coverImageId,
      status: nextStatus,
      publishedAt:
        nextStatus === 'PUBLISHED'
          ? (existing?.publishedAt ?? new Date())
          : (existing?.publishedAt ?? null),
      scheduledAt:
        nextStatus === 'SCHEDULED' && values.scheduledAt
          ? new Date(values.scheduledAt)
          : null,
      categoryId: values.categoryId,
      seoTitle: emptyToNull(values.seoTitle),
      seoDescription: emptyToNull(values.seoDescription),
      canonicalUrl: emptyToNull(values.canonicalUrl),
      allowComments: values.allowComments,
    }

    const post = existing
      ? await update({ id: existing.id, data, tagIds: values.tagIds })
      : await store({
          data: { ...data, authorId: session.user.id },
          tagIds: values.tagIds,
        })

    if (!autosave) {
      await storeRevision({
        postId: post.id,
        title: post.title,
        contentJson: post.contentJson,
      })
    }

    revalidateBlog()
    return { data: toPost(post), statusCode: 200 }
  } catch {
    return { statusCode: 500, message: 'Could not save post.' }
  }
}

export async function changePostStatus({
  id,
  status,
}: {
  id: string
  status: Exclude<PostStatus, 'SCHEDULED'>
}): Promise<Result<PostSummary>> {
  const session = await auth()
  if (!session) return UNAUTHENTICATED

  const existing = await show({ id })
  if (!existing) return NOT_FOUND
  if (!canEditPost(session.user, existing)) return FORBIDDEN
  if (status === 'PUBLISHED' && !canPublish(session.user.role)) {
    return FORBIDDEN
  }
  if (status === 'PUBLISHED' && !existing.title.trim()) {
    return { statusCode: 422, message: 'Add a title before publishing.' }
  }

  try {
    const post = await updateStatus({
      id,
      status,
      publishedAt:
        status === 'PUBLISHED'
          ? (existing.publishedAt ?? new Date())
          : undefined,
    })
    revalidateBlog()
    return { data: toPostSummary(post), statusCode: 200 }
  } catch {
    return { statusCode: 500, message: 'Could not update post.' }
  }
}

export async function deletePost({
  id,
}: {
  id: string
}): Promise<Result<null>> {
  const session = await auth()
  if (!session) return UNAUTHENTICATED

  const existing = await show({ id })
  if (!existing) return NOT_FOUND

  const ownDraft =
    existing.authorId === session.user.id && existing.status === 'DRAFT'
  if (!canPublish(session.user.role) && !ownDraft) return FORBIDDEN

  try {
    await destroy({ id })
    revalidateBlog()
    return { data: null, statusCode: 200 }
  } catch {
    return { statusCode: 500, message: 'Could not delete post.' }
  }
}

export async function getPublishedPosts({
  page = 1,
  categorySlug,
  tagSlug,
  authorSlug,
}: {
  page?: number
  categorySlug?: string
  tagSlug?: string
  authorSlug?: string
} = {}): Promise<
  Result<{ items: PostSummary[]; total: number; totalPages: number }>
> {
  try {
    const posts = (await indexPublished()).filter(
      (post) =>
        (!categorySlug || post.category?.slug === categorySlug) &&
        (!tagSlug || post.tags.some(({ tag }) => tag.slug === tagSlug)) &&
        (!authorSlug || post.author.slug === authorSlug),
    )
    const totalPages = Math.max(1, Math.ceil(posts.length / BLOG_PAGE_SIZE))
    const start = (Math.min(Math.max(page, 1), totalPages) - 1) * BLOG_PAGE_SIZE

    return {
      data: {
        items: posts.slice(start, start + BLOG_PAGE_SIZE).map(toPostSummary),
        total: posts.length,
        totalPages,
      },
      statusCode: 200,
    }
  } catch {
    return { statusCode: 500, message: 'Could not load posts.' }
  }
}

export async function getPublishedPost({
  slug,
}: {
  slug: string
}): Promise<Result<{ post: Post | null; redirectTo: string | null }>> {
  try {
    const post = await showBySlug({ slug })
    if (post?.status === 'PUBLISHED') {
      return { data: { post: toPost(post), redirectTo: null }, statusCode: 200 }
    }

    const redirect = await showRedirect({ slug })
    const target = redirect ? await show({ id: redirect.postId }) : null
    return {
      data: {
        post: null,
        redirectTo: target?.status === 'PUBLISHED' ? target.slug : null,
      },
      statusCode: target ? 200 : 404,
    }
  } catch {
    return { statusCode: 500, message: 'Could not load post.' }
  }
}
