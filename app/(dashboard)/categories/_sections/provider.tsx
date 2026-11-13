'use client'

import { ReactNode, useEffect } from 'react'
import { toast } from 'sonner'
import { useAppDispatch } from '@/hooks/hooks'
import { Category } from '@/models/category'
import { Result } from '@/models/result'
import { categoriesSlice } from '../_redux/categories-slice'

export default function Provider({
  categories,
  children,
}: {
  categories: Result<Category[]>
  children: ReactNode
}) {
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (categories.message) toast.error(categories.message)
    dispatch(categoriesSlice.actions.categoriesLoaded(categories.data ?? []))
  }, [categories, dispatch])

  return children
}
