'use client'

import { useMemo } from 'react'
import { useAppSelector } from '@/hooks/hooks'
import { paginate, visiblePosts } from '../_redux/posts-query'

export function useVisiblePosts() {
  const posts = useAppSelector((state) => state.postsState.posts)
  const searchTerm = useAppSelector((state) => state.postsState.searchTerm)
  const statusFilter = useAppSelector((state) => state.postsState.statusFilter)
  const page = useAppSelector((state) => state.postsState.page)

  const visible = useMemo(
    () => visiblePosts({ posts, searchTerm, statusFilter }),
    [posts, searchTerm, statusFilter],
  )

  return useMemo(() => paginate(visible, page), [visible, page])
}
