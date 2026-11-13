import 'server-only'

import type { JSONContent } from '@tiptap/core'
import { readingTime } from '@/lib/blog/content'
import { renderContent } from '@/lib/blog/render'
import { PostStatus } from '@/models/post'
import { Role } from '@/models/user'
import { showcaseContent } from './showcase-post'

// In-memory stand-in for the Prisma client while the demo is frontend-only.
// Record shapes mirror prisma/schema.prisma so services can switch to
// `prisma.*` calls without the actions or UI changing.

export interface UserRecord {
  id: string
  email: string
  name: string
  slug: string
  role: Role
  bio: string | null
  avatarUrl: string | null
  createdAt: Date
}

export interface PostRecord {
  id: string
  slug: string
  title: string
  excerpt: string | null
  contentJson: JSONContent
  contentHtml: string
  coverImageId: string | null
  status: PostStatus
  publishedAt: Date | null
  scheduledAt: Date | null
  authorId: string
  categoryId: string | null
  readingTime: number
  seoTitle: string | null
  seoDescription: string | null
  canonicalUrl: string | null
  allowComments: boolean
  createdAt: Date
  updatedAt: Date
}

export interface CategoryRecord {
  id: string
  slug: string
  name: string
  description: string | null
  parentId: string | null
}

export interface TagRecord {
  id: string
  slug: string
  name: string
}

export interface PostTagRecord {
  postId: string
  tagId: string
}

export interface MediaRecord {
  id: string
  key: string
  url: string
  mimeType: string
  size: number
  width: number | null
  height: number | null
  alt: string | null
  createdAt: Date
}

export interface PostRevisionRecord {
  id: string
  postId: string
  title: string
  contentJson: JSONContent
  createdAt: Date
}

export interface SlugRedirectRecord {
  oldSlug: string
  postId: string
}

interface MockDb {
  users: UserRecord[]
  posts: PostRecord[]
  categories: CategoryRecord[]
  tags: TagRecord[]
  postTags: PostTagRecord[]
  media: MediaRecord[]
  revisions: PostRevisionRecord[]
  slugRedirects: SlugRedirectRecord[]
}

export function cuid() {
  return 'c' + crypto.randomUUID().replaceAll('-', '').slice(0, 24)
}

export const DEMO_USER_ID = 'cdemoadmin0000000000000000'

function paragraph(text: string): JSONContent {
  return { type: 'paragraph', content: [{ type: 'text', text }] }
}

function heading(level: number, text: string): JSONContent {
  return {
    type: 'heading',
    attrs: { level },
    content: [{ type: 'text', text }],
  }
}

function doc(...content: JSONContent[]): JSONContent {
  return { type: 'doc', content }
}

function daysAgo(days: number) {
  return new Date(Date.now() - days * 86_400_000)
}

function seedPost(
  values: Pick<PostRecord, 'id' | 'slug' | 'title' | 'excerpt' | 'status'> & {
    contentJson: JSONContent
    categoryId: string | null
    coverImageId?: string | null
    publishedAt?: Date | null
    scheduledAt?: Date | null
    updatedAt: Date
  },
): PostRecord {
  return {
    coverImageId: null,
    publishedAt: null,
    scheduledAt: null,
    authorId: DEMO_USER_ID,
    seoTitle: null,
    seoDescription: null,
    canonicalUrl: null,
    allowComments: true,
    createdAt: values.updatedAt,
    ...values,
    contentHtml: renderContent(values.contentJson),
    readingTime: readingTime(values.contentJson),
  }
}

function seed(): MockDb {
  const now = new Date()

  return {
    users: [
      {
        id: DEMO_USER_ID,
        email: 'editor@demo-blog.test',
        name: 'Demo Editor',
        slug: 'demo-editor',
        role: 'ADMIN',
        bio: 'Writes about building things on the web.',
        avatarUrl: null,
        createdAt: now,
      },
    ],
    categories: [
      {
        id: 'ccatengineering00000000000',
        slug: 'engineering',
        name: 'Engineering',
        description: 'How we build and ship.',
        parentId: null,
      },
      {
        id: 'ccatfrontend000000000000000',
        slug: 'frontend',
        name: 'Frontend',
        description: null,
        parentId: 'ccatengineering00000000000',
      },
      {
        id: 'ccatcompany0000000000000000',
        slug: 'company',
        name: 'Company',
        description: 'News and updates.',
        parentId: null,
      },
    ],
    tags: [
      { id: 'ctagnextjs00000000000000000', slug: 'nextjs', name: 'Next.js' },
      { id: 'ctagtiptap00000000000000000', slug: 'tiptap', name: 'Tiptap' },
      { id: 'ctagprisma00000000000000000', slug: 'prisma', name: 'Prisma' },
      {
        id: 'ctagannounce000000000000000',
        slug: 'announcement',
        name: 'Announcement',
      },
    ],
    media: [
      {
        id: 'cmediahero00000000000000000',
        key: 'blog/2026/10/hero.jpg',
        url: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1600',
        mimeType: 'image/jpeg',
        size: 0,
        width: 1600,
        height: 1067,
        alt: 'A laptop and notebook on a wooden desk',
        createdAt: now,
      },
      {
        id: 'cmediashowcase0000000000000',
        key: 'blog/2026/10/showcase.jpg',
        url: 'https://images.unsplash.com/photo-1504691342899-4d92b50853e1?w=1600',
        mimeType: 'image/jpeg',
        size: 0,
        width: 1600,
        height: 1067,
        alt: 'Pens, a ruler, and color swatches on a designer’s desk',
        createdAt: now,
      },
    ],
    posts: [
      seedPost({
        id: 'cpostwelcome000000000000000',
        slug: 'welcome-to-the-blog',
        title: 'Welcome to the blog',
        excerpt: 'A quick tour of what this blog creator can do.',
        status: 'PUBLISHED',
        categoryId: 'ccatcompany0000000000000000',
        coverImageId: 'cmediahero00000000000000000',
        publishedAt: daysAgo(6),
        updatedAt: daysAgo(6),
        contentJson: doc(
          paragraph(
            'This post was written in the Tiptap editor and stored as JSON. The server renders it to sanitized HTML on save.',
          ),
          heading(2, 'What you can do'),
          {
            type: 'bulletList',
            content: [
              {
                type: 'listItem',
                content: [
                  paragraph('Write with headings, lists, quotes, and code.'),
                ],
              },
              {
                type: 'listItem',
                content: [
                  paragraph('Organize posts with categories and tags.'),
                ],
              },
              {
                type: 'listItem',
                content: [paragraph('Save drafts, schedule, and publish.')],
              },
            ],
          },
          {
            type: 'blockquote',
            content: [
              paragraph('Drafts autosave three seconds after you stop typing.'),
            ],
          },
        ),
      }),
      seedPost({
        id: 'cposttiptap0000000000000000',
        slug: 'why-we-store-tiptap-json',
        title: 'Why we store Tiptap JSON',
        excerpt: 'JSON is the source of truth; HTML is a render target.',
        status: 'PUBLISHED',
        categoryId: 'ccatfrontend000000000000000',
        publishedAt: daysAgo(2),
        updatedAt: daysAgo(2),
        contentJson: doc(
          paragraph(
            'WordPress keeps one string that mixes content and structure. We keep the editor document as JSON and store sanitized HTML next to it for fast rendering.',
          ),
          heading(2, 'Rendering on the server'),
          {
            type: 'codeBlock',
            attrs: { language: 'ts' },
            content: [
              {
                type: 'text',
                text: 'const html = sanitize(generateHTML(json, extensions))',
              },
            ],
          },
        ),
      }),
      seedPost({
        id: 'cpostshowcase00000000000000',
        slug: 'the-editor-feature-by-feature',
        title: 'The editor, feature by feature',
        excerpt:
          'A tour of every block and format the editor supports: tables, tasks, math, embeds, code, and more.',
        status: 'PUBLISHED',
        categoryId: 'ccatfrontend000000000000000',
        coverImageId: 'cmediashowcase0000000000000',
        publishedAt: daysAgo(0),
        updatedAt: daysAgo(0),
        contentJson: showcaseContent,
      }),
      seedPost({
        id: 'cpostprisma0000000000000000',
        slug: 'connecting-prisma',
        title: 'Connecting Prisma',
        excerpt: 'Next step: swap the mock store for a real database.',
        status: 'DRAFT',
        categoryId: 'ccatengineering00000000000',
        updatedAt: daysAgo(1),
        contentJson: doc(
          paragraph('The schema is ready in prisma/schema.prisma.'),
        ),
      }),
    ],
    postTags: [
      {
        postId: 'cpostwelcome000000000000000',
        tagId: 'ctagannounce000000000000000',
      },
      {
        postId: 'cposttiptap0000000000000000',
        tagId: 'ctagtiptap00000000000000000',
      },
      {
        postId: 'cposttiptap0000000000000000',
        tagId: 'ctagnextjs00000000000000000',
      },
      {
        postId: 'cpostprisma0000000000000000',
        tagId: 'ctagprisma00000000000000000',
      },
      {
        postId: 'cpostshowcase00000000000000',
        tagId: 'ctagtiptap00000000000000000',
      },
    ],
    revisions: [],
    slugRedirects: [],
  }
}

const globalForDb = globalThis as unknown as { mockDb?: MockDb }

export const db = globalForDb.mockDb ?? (globalForDb.mockDb = seed())
