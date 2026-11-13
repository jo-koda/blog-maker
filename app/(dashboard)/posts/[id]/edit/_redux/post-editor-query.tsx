import { EMPTY_DOC } from '@/lib/blog/content'
import { fromLocalInput, toLocalInput } from '@/lib/blog/format'
import { toSlug } from '@/lib/blog/slug'
import { Post, PostStatus, PostValues } from '@/models/post'
import { PostEditorValues } from './post-editor-state'

export const EMPTY_VALUES: PostEditorValues = {
  title: '',
  slug: '',
  excerpt: '',
  contentJson: EMPTY_DOC,
  coverImageUrl: '',
  coverImageAlt: '',
  categoryId: null,
  tagIds: [],
  scheduledAt: '',
  seoTitle: '',
  seoDescription: '',
  canonicalUrl: '',
  allowComments: true,
}

export function valuesFromPost(post: Post): PostEditorValues {
  return {
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt ?? '',
    contentJson: post.contentJson,
    coverImageUrl: post.coverImage?.url ?? '',
    coverImageAlt: post.coverImage?.alt ?? '',
    categoryId: post.category?.id ?? null,
    tagIds: post.tags.map((tag) => tag.id),
    scheduledAt: toLocalInput(post.scheduledAt),
    seoTitle: post.seoTitle ?? '',
    seoDescription: post.seoDescription ?? '',
    canonicalUrl: post.canonicalUrl ?? '',
    allowComments: post.allowComments,
  }
}

export function slugFollowsTitle(post: Post) {
  return post.status === 'DRAFT' && post.slug === toSlug(post.title)
}

export function toPayload(values: PostEditorValues): PostValues {
  return { ...values, scheduledAt: fromLocalInput(values.scheduledAt) }
}

export function isFuture(localInput: string) {
  return !!localInput && new Date(localInput).getTime() > Date.now()
}

export function publishIntent(values: PostEditorValues): PostStatus {
  return isFuture(values.scheduledAt) ? 'SCHEDULED' : 'PUBLISHED'
}
