import Image from 'next/image'
import Link from 'next/link'
import { formatDate } from '@/lib/blog/format'
import { outline } from '@/lib/blog/outline'
import { Post } from '@/models/post'

export function PostArticle({ post }: { post: Post }) {
  const headings = outline(post.contentJson)

  return (
    <article className='mx-auto max-w-2xl'>
      <nav aria-label='Breadcrumb' className='text-muted-foreground text-sm'>
        <Link href='/blog' className='hover:text-foreground'>
          Blog
        </Link>
        {post.category && (
          <>
            <span className='mx-1.5'>/</span>
            <Link
              href={`/blog/category/${post.category.slug}`}
              className='hover:text-foreground'
            >
              {post.category.name}
            </Link>
          </>
        )}
      </nav>

      <h1 className='mt-3 font-serif text-4xl leading-tight font-semibold md:text-5xl'>
        {post.title || 'Untitled'}
      </h1>
      {post.excerpt && (
        <p className='text-muted-foreground mt-3 text-lg'>{post.excerpt}</p>
      )}
      <p className='text-muted-foreground mt-4 text-sm'>
        {post.author.name} · {formatDate(post.publishedAt ?? post.updatedAt)} ·{' '}
        {post.readingTime} min read
      </p>

      {post.coverImage && (
        <div className='bg-muted relative mt-8 aspect-video overflow-hidden rounded-xl'>
          <Image
            src={post.coverImage.url}
            alt={post.coverImage.alt ?? ''}
            fill
            priority
            sizes='(min-width: 768px) 672px, 100vw'
            className='object-cover'
          />
        </div>
      )}

      {headings.length >= 3 && (
        <nav
          aria-label='On this page'
          className='bg-muted/60 mt-8 rounded-xl px-5 py-4 text-sm'
        >
          <p className='font-semibold'>On this page</p>
          <ol className='mt-2 flex flex-col gap-1.5'>
            {headings.map((heading) => (
              <li
                key={heading.id}
                style={{ paddingLeft: `${(heading.level - 2) * 16}px` }}
              >
                <a
                  href={`#${heading.id}`}
                  className='text-muted-foreground hover:text-foreground'
                >
                  {heading.text}
                </a>
              </li>
            ))}
          </ol>
        </nav>
      )}

      <div
        className='prose prose-lg prose-headings:font-sans prose-headings:font-semibold mt-8 max-w-none font-serif'
        dangerouslySetInnerHTML={{ __html: post.contentHtml }}
      />

      {post.tags.length > 0 && (
        <div className='mt-10 flex flex-wrap gap-2 border-t pt-6'>
          {post.tags.map((tag) => (
            <Link
              key={tag.id}
              href={`/blog/tag/${tag.slug}`}
              className='bg-muted hover:bg-accent rounded-full px-3 py-1 text-sm'
            >
              #{tag.name}
            </Link>
          ))}
        </div>
      )}
    </article>
  )
}
