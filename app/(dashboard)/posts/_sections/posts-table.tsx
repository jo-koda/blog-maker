'use client'

import Link from 'next/link'
import {
  Archive,
  Eye,
  FileText,
  Globe,
  Pencil,
  RotateCcw,
  Trash2,
  Undo2,
} from 'lucide-react'
import { StatusBadge } from '@/components/status-badge'
import { Button, buttonVariants } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useAppDispatch, useAppSelector } from '@/hooks/hooks'
import { formatDate } from '@/lib/blog/format'
import { PostSummary } from '@/models/post'
import { useVisiblePosts } from '../_components/use-visible-posts'
import { usePostMutations } from '../_components/use-post-mutations'
import { postDate } from '../_redux/posts-query'
import { postsSlice } from '../_redux/posts-slice'

function RowActions({ post }: { post: PostSummary }) {
  const dispatch = useAppDispatch()
  const busy = useAppSelector(
    (state) => state.postsState.busyPostId === post.id,
  )
  const { setStatus } = usePostMutations()
  const iconLink = buttonVariants({ variant: 'ghost', size: 'icon' })

  return (
    <div className='flex justify-end gap-0.5'>
      <Link href={`/posts/${post.id}/edit`} className={iconLink} title='Edit'>
        <Pencil />
      </Link>
      {post.status === 'PUBLISHED' ? (
        <>
          <Link
            href={`/blog/${post.slug}`}
            target='_blank'
            className={iconLink}
            title='View on blog'
          >
            <Globe />
          </Link>
          <Button
            variant='ghost'
            size='icon'
            title='Unpublish'
            disabled={busy}
            onClick={() => setStatus(post, 'DRAFT')}
          >
            <Undo2 />
          </Button>
        </>
      ) : (
        <Link
          href={`/posts/${post.id}/preview`}
          target='_blank'
          className={iconLink}
          title='Preview'
        >
          <Eye />
        </Link>
      )}
      {post.status === 'ARCHIVED' ? (
        <Button
          variant='ghost'
          size='icon'
          title='Restore to draft'
          disabled={busy}
          onClick={() => setStatus(post, 'DRAFT')}
        >
          <RotateCcw />
        </Button>
      ) : (
        <Button
          variant='ghost'
          size='icon'
          title='Archive'
          disabled={busy}
          onClick={() => setStatus(post, 'ARCHIVED')}
        >
          <Archive />
        </Button>
      )}
      <Button
        variant='ghost'
        size='icon'
        title='Delete'
        disabled={busy}
        className='hover:text-destructive'
        onClick={() =>
          dispatch(postsSlice.actions.deleteTargetChanged(post.id))
        }
      >
        <Trash2 />
      </Button>
    </div>
  )
}

export default function PostsTable() {
  const loading = useAppSelector((state) => state.postsState.loading)
  const { items } = useVisiblePosts()

  if (loading) return <Skeleton className='h-96 w-full rounded-xl' />

  if (items.length === 0) {
    return (
      <div className='bg-card flex flex-col items-center gap-2 rounded-xl border px-6 py-16 text-center'>
        <FileText className='text-muted-foreground size-8' />
        <p className='font-medium'>No posts here yet</p>
        <p className='text-muted-foreground text-sm'>
          Start writing and your posts will show up in this list.
        </p>
        <Link href='/posts/new' className={`${buttonVariants()} mt-2`}>
          Write a post
        </Link>
      </div>
    )
  }

  return (
    <div className='bg-card overflow-x-auto rounded-xl border'>
      <table className='w-full min-w-[760px] text-sm'>
        <thead>
          <tr className='text-muted-foreground border-b text-left text-xs'>
            <th className='px-4 py-2.5 font-medium'>Title</th>
            <th className='px-4 py-2.5 font-medium'>Author</th>
            <th className='px-4 py-2.5 font-medium'>Category</th>
            <th className='px-4 py-2.5 font-medium'>Tags</th>
            <th className='px-4 py-2.5 font-medium'>Status</th>
            <th className='px-4 py-2.5 font-medium'>Date</th>
            <th className='px-4 py-2.5'>
              <span className='sr-only'>Actions</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {items.map((post) => {
            const date = postDate(post)
            return (
              <tr key={post.id} className='border-b last:border-0'>
                <td className='max-w-xs px-4 py-3'>
                  <Link
                    href={`/posts/${post.id}/edit`}
                    className='hover:text-primary block truncate font-medium'
                  >
                    {post.title || 'Untitled'}
                  </Link>
                  <span className='text-muted-foreground block truncate text-xs'>
                    /blog/{post.slug}
                  </span>
                </td>
                <td className='px-4 py-3'>{post.author.name}</td>
                <td className='px-4 py-3'>
                  {post.category?.name ?? (
                    <span className='text-muted-foreground'>—</span>
                  )}
                </td>
                <td className='text-muted-foreground max-w-40 truncate px-4 py-3'>
                  {post.tags.map((tag) => tag.name).join(', ') || '—'}
                </td>
                <td className='px-4 py-3'>
                  <StatusBadge status={post.status} />
                </td>
                <td className='px-4 py-3 whitespace-nowrap'>
                  <span className='text-muted-foreground block text-xs'>
                    {date.label}
                  </span>
                  {formatDate(date.iso)}
                </td>
                <td className='px-3 py-3'>
                  <RowActions post={post} />
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
