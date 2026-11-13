'use client'

import { Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useAppDispatch, useAppSelector } from '@/hooks/hooks'
import { tagsSlice } from '../_redux/tags-slice'

export default function TagsTable() {
  const dispatch = useAppDispatch()
  const tags = useAppSelector((state) => state.tagsState.tags)
  const loading = useAppSelector((state) => state.tagsState.loading)

  if (loading) return <Skeleton className='h-72 rounded-xl' />

  if (tags.length === 0) {
    return (
      <div className='bg-card text-muted-foreground rounded-xl border px-6 py-12 text-center text-sm'>
        No tags yet. Add one here or while writing a post.
      </div>
    )
  }

  return (
    <div className='bg-card overflow-x-auto rounded-xl border'>
      <table className='w-full min-w-[420px] text-sm'>
        <thead>
          <tr className='text-muted-foreground border-b text-left text-xs'>
            <th className='px-4 py-2.5 font-medium'>Name</th>
            <th className='px-4 py-2.5 font-medium'>Slug</th>
            <th className='px-4 py-2.5 text-right font-medium'>Posts</th>
            <th className='px-4 py-2.5'>
              <span className='sr-only'>Actions</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {tags.map((tag) => (
            <tr key={tag.id} className='border-b last:border-0'>
              <td className='px-4 py-3 font-medium'>{tag.name}</td>
              <td className='text-muted-foreground px-4 py-3'>{tag.slug}</td>
              <td className='px-4 py-3 text-right'>{tag.postCount}</td>
              <td className='px-3 py-3 text-right'>
                <Button
                  variant='ghost'
                  size='icon'
                  title='Delete'
                  className='hover:text-destructive'
                  onClick={() =>
                    dispatch(tagsSlice.actions.deleteTargetChanged(tag.id))
                  }
                >
                  <Trash2 />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
