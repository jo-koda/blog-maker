import Image from 'next/image'
import Link from 'next/link'
import { formatDate } from '@/lib/blog/format'
import { PostSummary } from '@/models/post'

function PostCard({ post }: { post: PostSummary }) {
  return (
    <article className='grid gap-5 border-b py-8 first:pt-0 last:border-0 sm:grid-cols-[minmax(0,1fr)_200px]'>
      <div>
        {post.category && (
          <Link
            href={`/blog/category/${post.category.slug}`}
            className='text-primary text-xs font-semibold tracking-wide uppercase'
          >
            {post.category.name}
          </Link>
        )}
        <h2 className='mt-1 font-serif text-2xl leading-snug font-semibold'>
          <Link href={`/blog/${post.slug}`} className='hover:text-primary'>
            {post.title}
          </Link>
        </h2>
        {post.excerpt && (
          <p className='text-muted-foreground mt-2'>{post.excerpt}</p>
        )}
        <p className='text-muted-foreground mt-3 text-sm'>
          {post.author.name} · {formatDate(post.publishedAt)} ·{' '}
          {post.readingTime} min read
        </p>
      </div>
      {post.coverImage && (
        <Link
          href={`/blog/${post.slug}`}
          className='bg-muted relative order-first aspect-video overflow-hidden rounded-lg sm:order-last'
        >
          <Image
            src={post.coverImage.url}
            alt={post.coverImage.alt ?? ''}
            fill
            sizes='(min-width: 640px) 200px, 100vw'
            className='object-cover'
          />
        </Link>
      )}
    </article>
  )
}

export function PostList({
  posts,
  page,
  totalPages,
  basePath,
}: {
  posts: PostSummary[]
  page: number
  totalPages: number
  basePath: string
}) {
  if (posts.length === 0) {
    return (
      <p className='text-muted-foreground py-16 text-center'>
        Nothing published here yet.
      </p>
    )
  }

  const href = (target: number) =>
    target === 1 ? basePath : `${basePath}?page=${target}`

  return (
    <>
      <div>
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
      {totalPages > 1 && (
        <nav
          aria-label='Pagination'
          className='mt-8 flex items-center justify-between text-sm'
        >
          {page > 1 ? (
            <Link href={href(page - 1)} className='hover:text-primary'>
              ← Newer posts
            </Link>
          ) : (
            <span />
          )}
          <span className='text-muted-foreground'>
            Page {page} of {totalPages}
          </span>
          {page < totalPages ? (
            <Link href={href(page + 1)} className='hover:text-primary'>
              Older posts →
            </Link>
          ) : (
            <span />
          )}
        </nav>
      )}
    </>
  )
}
