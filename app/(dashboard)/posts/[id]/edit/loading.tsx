import { Skeleton } from '@/components/ui/skeleton'

export default function Loading() {
  return (
    <div className='flex flex-col gap-4'>
      <div className='flex justify-between'>
        <Skeleton className='h-8 w-24' />
        <div className='flex gap-2'>
          <Skeleton className='h-9 w-24' />
          <Skeleton className='h-9 w-24' />
        </div>
      </div>
      <div className='grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]'>
        <Skeleton className='h-[600px] rounded-xl' />
        <div className='flex flex-col gap-4'>
          <Skeleton className='h-56 rounded-xl' />
          <Skeleton className='h-40 rounded-xl' />
        </div>
      </div>
    </div>
  )
}
