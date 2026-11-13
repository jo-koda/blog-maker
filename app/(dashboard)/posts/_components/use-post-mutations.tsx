'use client'

import { useCallback } from 'react'
import { toast } from 'sonner'
import { useAppDispatch } from '@/hooks/hooks'
import { changePostStatus, deletePost } from '@/actions/api-actions/post-action'
import { STATUS_LABEL } from '@/lib/blog/constants'
import { PostStatus, PostSummary } from '@/models/post'
import { Result } from '@/models/result'
import { postsSlice } from '../_redux/posts-slice'

const actions = postsSlice.actions

export function usePostMutations() {
  const dispatch = useAppDispatch()

  const run = useCallback(
    async <T,>(
      post: PostSummary,
      request: () => Promise<Result<T>>,
      success: (result: Result<T>) => void,
    ) => {
      dispatch(actions.busyPostChanged(post.id))
      try {
        const result = await request()
        if (result.statusCode !== 200) {
          toast.error(result.message)
          return
        }
        success(result)
      } finally {
        dispatch(actions.busyPostChanged(null))
      }
    },
    [dispatch],
  )

  const setStatus = (
    post: PostSummary,
    status: Exclude<PostStatus, 'SCHEDULED'>,
  ) =>
    run(
      post,
      () => changePostStatus({ id: post.id, status }),
      (result) => {
        if (result.data) dispatch(actions.postPatched(result.data))
        toast.success(`Moved to ${STATUS_LABEL[status].toLowerCase()}.`)
      },
    )

  const remove = (post: PostSummary) =>
    run(
      post,
      () => deletePost({ id: post.id }),
      () => {
        dispatch(actions.deleteTargetChanged(null))
        dispatch(actions.postRemoved(post.id))
        toast.success('Post deleted.')
      },
    )

  return { setStatus, remove }
}
