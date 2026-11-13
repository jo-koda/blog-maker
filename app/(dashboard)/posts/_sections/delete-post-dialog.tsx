'use client'

import { Modal } from '@/components/modal'
import { Button } from '@/components/ui/button'
import { useAppDispatch, useAppSelector } from '@/hooks/hooks'
import { usePostMutations } from '../_components/use-post-mutations'
import { postsSlice } from '../_redux/posts-slice'

export default function DeletePostDialog() {
  const dispatch = useAppDispatch()
  const target = useAppSelector((state) =>
    state.postsState.posts.find(
      (post) => post.id === state.postsState.deleteTargetId,
    ),
  )
  const busy = useAppSelector(
    (state) => !!target && state.postsState.busyPostId === target.id,
  )
  const { remove } = usePostMutations()

  const close = () => dispatch(postsSlice.actions.deleteTargetChanged(null))

  return (
    <Modal
      open={!!target}
      title='Delete post?'
      onClose={close}
      footer={
        <>
          <Button variant='outline' onClick={close}>
            Cancel
          </Button>
          <Button
            variant='destructive'
            disabled={busy}
            onClick={() => target && remove(target)}
          >
            {busy ? 'Deleting…' : 'Delete'}
          </Button>
        </>
      }
    >
      <p>
        <strong>{target?.title || 'Untitled'}</strong> and its revisions will be
        removed permanently. To hide it without deleting, archive it instead.
      </p>
    </Modal>
  )
}
