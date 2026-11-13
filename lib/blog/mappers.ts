import { CategoryRecord, TagRecord } from '@/lib/mock/db'
import { PostWithRelations } from '@/services/post-service'
import { Category } from '@/models/category'
import { Post, PostSummary } from '@/models/post'
import { Tag } from '@/models/tag'

// Prisma returns camelCase rows with Date objects; models carry ISO strings so
// they can cross the server/client boundary and live in Redux.
function iso(date: Date | null) {
  return date ? date.toISOString() : null
}

export function toPostSummary(post: PostWithRelations): PostSummary {
  return {
    id: post.id,
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    status: post.status,
    publishedAt: iso(post.publishedAt),
    scheduledAt: iso(post.scheduledAt),
    readingTime: post.readingTime,
    author: {
      id: post.author.id,
      name: post.author.name,
      slug: post.author.slug,
      avatarUrl: post.author.avatarUrl,
    },
    category: post.category
      ? {
          id: post.category.id,
          name: post.category.name,
          slug: post.category.slug,
        }
      : null,
    tags: post.tags.map(({ tag }) => ({
      id: tag.id,
      name: tag.name,
      slug: tag.slug,
    })),
    coverImage: post.coverImage
      ? {
          id: post.coverImage.id,
          url: post.coverImage.url,
          alt: post.coverImage.alt,
        }
      : null,
    createdAt: post.createdAt.toISOString(),
    updatedAt: post.updatedAt.toISOString(),
  }
}

export function toPost(post: PostWithRelations): Post {
  return {
    ...toPostSummary(post),
    contentJson: post.contentJson,
    contentHtml: post.contentHtml,
    seoTitle: post.seoTitle,
    seoDescription: post.seoDescription,
    canonicalUrl: post.canonicalUrl,
    allowComments: post.allowComments,
  }
}

export function toCategory(
  category: CategoryRecord & { _count: { posts: number } },
): Category {
  return {
    id: category.id,
    slug: category.slug,
    name: category.name,
    description: category.description,
    parentId: category.parentId,
    postCount: category._count.posts,
  }
}

export function toTag(tag: TagRecord & { _count: { posts: number } }): Tag {
  return {
    id: tag.id,
    slug: tag.slug,
    name: tag.name,
    postCount: tag._count.posts,
  }
}
