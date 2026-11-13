import type { JSONContent } from '@tiptap/core'

export type PostStatus = 'DRAFT' | 'SCHEDULED' | 'PUBLISHED' | 'ARCHIVED'

export interface PostAuthor {
  id: string
  name: string
  slug: string
  avatarUrl: string | null
}

export interface PostTerm {
  id: string
  name: string
  slug: string
}

export interface PostCover {
  id: string
  url: string
  alt: string | null
}

export interface PostSummary {
  id: string
  slug: string
  title: string
  excerpt: string | null
  status: PostStatus
  publishedAt: string | null
  scheduledAt: string | null
  readingTime: number
  author: PostAuthor
  category: PostTerm | null
  tags: PostTerm[]
  coverImage: PostCover | null
  createdAt: string
  updatedAt: string
}

export interface Post extends PostSummary {
  contentJson: JSONContent
  contentHtml: string
  seoTitle: string | null
  seoDescription: string | null
  canonicalUrl: string | null
  allowComments: boolean
}

export interface PostValues {
  title: string
  slug: string
  excerpt: string
  contentJson: JSONContent
  coverImageUrl: string
  coverImageAlt: string
  categoryId: string | null
  tagIds: string[]
  scheduledAt: string | null
  seoTitle: string
  seoDescription: string
  canonicalUrl: string
  allowComments: boolean
}
