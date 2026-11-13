import type { Metadata } from 'next'
import { Post } from '@/models/post'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'

export function postUrl(slug: string) {
  return `${SITE_URL}/blog/${slug}`
}

export function buildPostMetadata(post: Post): Metadata {
  const url = postUrl(post.slug)
  const title = post.seoTitle ?? post.title
  const description = post.seoDescription ?? post.excerpt ?? ''

  return {
    title,
    description,
    alternates: { canonical: post.canonicalUrl ?? url },
    openGraph: {
      type: 'article',
      url,
      title,
      description,
      publishedTime: post.publishedAt ?? undefined,
      modifiedTime: post.updatedAt,
      authors: [post.author.name],
      images: post.coverImage ? [{ url: post.coverImage.url }] : [],
    },
    twitter: { card: 'summary_large_image', title, description },
  }
}

// `<` is escaped so a title like "</script>" cannot break out of the tag.
export function buildPostJsonLd(post: Post) {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.seoDescription ?? post.excerpt ?? undefined,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    author: { '@type': 'Person', name: post.author.name },
    image: post.coverImage?.url,
    mainEntityOfPage: postUrl(post.slug),
  }).replace(/</g, '\\u003c')
}
