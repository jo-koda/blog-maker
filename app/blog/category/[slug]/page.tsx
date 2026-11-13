import { Metadata } from 'next'
import { getPublishedPosts } from '@/actions/api-actions/post-action'
import { PostList } from '@/components/blog/post-list'

type Props = {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ page?: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  return {
    title: `Category: ${slug}`,
    alternates: { canonical: `/blog/category/${slug}` },
  }
}

export default async function Page({ params, searchParams }: Props) {
  const { slug } = await params
  const page = Number((await searchParams).page) || 1
  const result = await getPublishedPosts({ page, categorySlug: slug })
  const name = result.data?.items[0]?.category?.name ?? slug

  return (
    <>
      <p className='text-muted-foreground text-sm'>Category</p>
      <h1 className='mb-8 font-serif text-3xl font-semibold'>{name}</h1>
      <PostList
        posts={result.data?.items ?? []}
        page={page}
        totalPages={result.data?.totalPages ?? 1}
        basePath={`/blog/category/${slug}`}
      />
    </>
  )
}
