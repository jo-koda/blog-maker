import { Metadata } from 'next'
import { Suspense } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import CategoriesView from './_sections/categories-view'

export const metadata: Metadata = {
  title: 'Categories',
}

export default function Page() {
  return (
    <Suspense fallback={<Skeleton className='h-96 w-full rounded-xl' />}>
      <CategoriesView />
    </Suspense>
  )
}
