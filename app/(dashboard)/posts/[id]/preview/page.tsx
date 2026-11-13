import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPost } from '@/actions/api-actions/post-action'
import { PostArticle } from '@/components/blog/post-article'
import { StatusBadge } from '@/components/status-badge'

export const metadata: Metadata = {
  title: 'Preview',
  robots: { index: false },
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const result = await getPost({ id })
  if (!result.data) notFound()

  return (
    <div className='flex flex-col gap-6'>
      <div className='bg-card flex items-center justify-between gap-3 rounded-xl border px-4 py-2.5 text-sm'>
        <span className='flex items-center gap-2'>
          Preview <StatusBadge status={result.data.status} />
        </span>
        <span className='text-muted-foreground'>
          Showing the last saved version
        </span>
      </div>
      <div className='bg-card rounded-xl border px-4 py-10'>
        <PostArticle post={result.data} />
      </div>
    </div>
  )
}
