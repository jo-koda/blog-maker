'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAppDispatch } from '@/hooks/hooks'
import { useVisiblePosts } from '../_components/use-visible-posts'
import { postsSlice } from '../_redux/posts-slice'

export default function PaginationBar() {
  const dispatch = useAppDispatch()
  const { total, totalPages, currentPage, start, end } = useVisiblePosts()

  if (total === 0) return null

  return (
    <div className='text-muted-foreground flex items-center justify-between text-sm'>
      <span>
        {start + 1}–{end} of {total}
      </span>
      <div className='flex items-center gap-1'>
        <Button
          variant='outline'
          size='icon'
          aria-label='Previous page'
          disabled={currentPage <= 1}
          onClick={() =>
            dispatch(postsSlice.actions.pageChanged(currentPage - 1))
          }
        >
          <ChevronLeft />
        </Button>
        <span className='px-2'>
          {currentPage} / {totalPages}
        </span>
        <Button
          variant='outline'
          size='icon'
          aria-label='Next page'
          disabled={currentPage >= totalPages}
          onClick={() =>
            dispatch(postsSlice.actions.pageChanged(currentPage + 1))
          }
        >
          <ChevronRight />
        </Button>
      </div>
    </div>
  )
}
