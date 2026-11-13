import { Skeleton } from '@/components/ui/skeleton'

export default function Loading() {
  return (
    <div className='flex flex-col gap-4'>
      <div className='flex items-start justify-between'>
        <div className='flex flex-col gap-2'>
          <Skeleton className='h-6 w-32' />
          <Skeleton className='h-4 w-64' />
        </div>
        <Skeleton className='h-9 w-28' />
      </div>
      <Skeleton className='h-9 w-full max-w-xl' />
      <Skeleton className='h-96 w-full rounded-xl' />
    </div>
  )
}
