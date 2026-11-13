import { Metadata } from 'next'
import { Suspense } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import TagsView from './_sections/tags-view'

export const metadata: Metadata = {
  title: 'Tags',
}

export default function Page() {
  return (
    <Suspense fallback={<Skeleton className='h-96 w-full rounded-xl' />}>
      <TagsView />
    </Suspense>
  )
}
