'use client'

import { ReactNode, useEffect } from 'react'
import { toast } from 'sonner'
import { useAppDispatch } from '@/hooks/hooks'
import { PostSummary } from '@/models/post'
import { Result } from '@/models/result'
import { postsSlice } from '../_redux/posts-slice'

export default function Provider({
  posts,
  children,
}: {
  posts: Result<PostSummary[]>
  children: ReactNode
}) {
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (posts.message) toast.error(posts.message)
    dispatch(postsSlice.actions.postsLoaded(posts.data ?? []))
  }, [posts, dispatch])

  return children
}
