'use client'

import { useMemo } from 'react'
import { Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useAppDispatch, useAppSelector } from '@/hooks/hooks'
import { categoryOptions } from '@/lib/blog/category-tree'
import { categoriesSlice } from '../_redux/categories-slice'

export default function CategoriesTable() {
  const dispatch = useAppDispatch()
  const categories = useAppSelector((state) => state.categoriesState.categories)
  const loading = useAppSelector((state) => state.categoriesState.loading)

  const rows = useMemo(() => {
    const byId = new Map(categories.map((category) => [category.id, category]))
    return categoryOptions(categories).map((option) => ({
      ...byId.get(option.id)!,
      label: option.label,
    }))
  }, [categories])

  if (loading) return <Skeleton className='h-72 rounded-xl' />

  if (rows.length === 0) {
    return (
      <div className='bg-card text-muted-foreground rounded-xl border px-6 py-12 text-center text-sm'>
        No categories yet. Add your first one on the left.
      </div>
    )
  }

  return (
    <div className='bg-card overflow-x-auto rounded-xl border'>
      <table className='w-full min-w-[520px] text-sm'>
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
          {rows.map((category) => (
            <tr key={category.id} className='border-b last:border-0'>
              <td className='px-4 py-3'>
                <span className='font-medium'>{category.label}</span>
                {category.description && (
                  <span className='text-muted-foreground block text-xs'>
                    {category.description}
                  </span>
                )}
              </td>
              <td className='text-muted-foreground px-4 py-3'>
                {category.slug}
              </td>
              <td className='px-4 py-3 text-right'>{category.postCount}</td>
              <td className='px-3 py-3 text-right'>
                <Button
                  variant='ghost'
                  size='icon'
                  title='Delete'
                  className='hover:text-destructive'
                  onClick={() =>
                    dispatch(
                      categoriesSlice.actions.deleteTargetChanged(category.id),
                    )
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
