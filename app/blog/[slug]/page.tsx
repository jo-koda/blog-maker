import { Metadata } from 'next'
import { notFound, permanentRedirect } from 'next/navigation'
import { getPublishedPost } from '@/actions/api-actions/post-action'
import { PostArticle } from '@/components/blog/post-article'
import { buildPostJsonLd, buildPostMetadata } from '@/lib/blog/seo'

type Params = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params
  const post = (await getPublishedPost({ slug })).data?.post
  return post ? buildPostMetadata(post) : {}
}

export default async function Page({ params }: Params) {
  const { slug } = await params
  const result = await getPublishedPost({ slug })

  if (result.data?.redirectTo)
    permanentRedirect(`/blog/${result.data.redirectTo}`)
  const post = result.data?.post
  if (!post) notFound()

  return (
    <>
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: buildPostJsonLd(post) }}
      />
      <PostArticle post={post} />
    </>
  )
}
