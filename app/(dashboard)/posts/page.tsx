import { Metadata } from 'next'
import { Suspense } from 'react'
import Loading from './loading'
import PostsView from './_sections/posts-view'

export const metadata: Metadata = {
  title: 'Posts',
}

export default function Page() {
  return (
    <Suspense fallback={<Loading />}>
      <PostsView />
    </Suspense>
  )
}
