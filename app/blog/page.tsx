import { Metadata } from 'next'
import { getPublishedPosts } from '@/actions/api-actions/post-action'
import { PostList } from '@/components/blog/post-list'

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}): Promise<Metadata> {
  const page = Number((await searchParams).page) || 1
  return {
    title: page > 1 ? `Blog · Page ${page}` : 'Blog',
    alternates: { canonical: page > 1 ? `/blog?page=${page}` : '/blog' },
  }
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  const page = Number((await searchParams).page) || 1
  const result = await getPublishedPosts({ page })

  return (
    <>
      <h1 className='mb-8 font-serif text-3xl font-semibold'>Latest posts</h1>
      <PostList
        posts={result.data?.items ?? []}
        page={page}
        totalPages={result.data?.totalPages ?? 1}
        basePath='/blog'
      />
    </>
  )
}
