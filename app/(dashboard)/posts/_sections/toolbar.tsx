'use client'

import { useMemo } from 'react'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { useAppDispatch, useAppSelector } from '@/hooks/hooks'
import { POST_STATUSES, STATUS_LABEL } from '@/lib/blog/constants'
import { cn } from '@/lib/utils'
import { statusCounts } from '../_redux/posts-query'
import { postsSlice } from '../_redux/posts-slice'
import { PostStatusFilter } from '../_redux/posts-state'

const FILTERS: { value: PostStatusFilter; label: string }[] = [
  { value: 'ALL', label: 'All' },
  ...POST_STATUSES.map((status) => ({
    value: status,
    label: STATUS_LABEL[status],
  })),
]

export default function Toolbar() {
  const dispatch = useAppDispatch()
  const posts = useAppSelector((state) => state.postsState.posts)
  const searchTerm = useAppSelector((state) => state.postsState.searchTerm)
  const statusFilter = useAppSelector((state) => state.postsState.statusFilter)
  const counts = useMemo(() => statusCounts(posts), [posts])

  return (
    <div className='flex flex-wrap items-center justify-between gap-3'>
      <div className='flex flex-wrap gap-1'>
        {FILTERS.map(({ value, label }) => (
          <button
            key={value}
            type='button'
            onClick={() =>
              dispatch(postsSlice.actions.statusFilterChanged(value))
            }
            className={cn(
              'cursor-pointer rounded-full px-3 py-1 text-sm transition-colors',
              statusFilter === value
                ? 'bg-foreground text-background'
                : 'text-muted-foreground hover:bg-muted',
            )}
          >
            {label}
            <span className='ml-1.5 opacity-60'>{counts[value]}</span>
          </button>
        ))}
      </div>

      <div className='relative w-full sm:w-64'>
        <Search className='text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2' />
        <Input
          type='search'
          value={searchTerm}
          onChange={(event) =>
            dispatch(postsSlice.actions.searchTermChanged(event.target.value))
          }
          placeholder='Search posts'
          aria-label='Search posts'
          className='pl-9'
        />
      </div>
    </div>
  )
}
