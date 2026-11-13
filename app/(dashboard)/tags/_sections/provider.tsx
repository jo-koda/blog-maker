'use client'

import { ReactNode, useEffect } from 'react'
import { toast } from 'sonner'
import { useAppDispatch } from '@/hooks/hooks'
import { Result } from '@/models/result'
import { Tag } from '@/models/tag'
import { tagsSlice } from '../_redux/tags-slice'

export default function Provider({
  tags,
  children,
}: {
  tags: Result<Tag[]>
  children: ReactNode
}) {
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (tags.message) toast.error(tags.message)
    dispatch(tagsSlice.actions.tagsLoaded(tags.data ?? []))
  }, [tags, dispatch])

  return children
}
