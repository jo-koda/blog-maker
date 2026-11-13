'use client'

import { ReactNode, useEffect, useRef } from 'react'
import { toast } from 'sonner'
import { useAppDispatch, useAppSelector } from '@/hooks/hooks'
import { Skeleton } from '@/components/ui/skeleton'
import { Category } from '@/models/category'
import { Post } from '@/models/post'
import { Result } from '@/models/result'
import { Tag } from '@/models/tag'
import { postEditorSlice } from '../_redux/post-editor-slice'

export default function Provider({
  post,
  categories,
  tags,
  children,
}: {
  post: Post | null
  categories: Result<Category[]>
  tags: Result<Tag[]>
  children: ReactNode
}) {
  const dispatch = useAppDispatch()
  const loaded = useAppSelector((state) => state.postEditorState.loaded)
  const initial = useRef({ post, categories, tags })

  useEffect(() => {
    const { post, categories, tags } = initial.current
    if (categories.message) toast.error(categories.message)
    if (tags.message) toast.error(tags.message)
    dispatch(
      postEditorSlice.actions.editorLoaded({
        post,
        categories: categories.data ?? [],
        tags: tags.data ?? [],
      }),
    )
    return () => {
      dispatch(postEditorSlice.actions.editorReset())
    }
  }, [dispatch])

  if (!loaded) return <Skeleton className='h-[600px] w-full rounded-xl' />

  return children
}
