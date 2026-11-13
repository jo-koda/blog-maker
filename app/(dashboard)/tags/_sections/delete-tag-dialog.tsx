'use client'

import { toast } from 'sonner'
import { Modal } from '@/components/modal'
import { Button } from '@/components/ui/button'
import { useAppDispatch, useAppSelector } from '@/hooks/hooks'
import { deleteTag } from '@/actions/api-actions/tag-action'
import { tagsSlice } from '../_redux/tags-slice'

const actions = tagsSlice.actions

export default function DeleteTagDialog() {
  const dispatch = useAppDispatch()
  const target = useAppSelector((state) =>
    state.tagsState.tags.find(
      (tag) => tag.id === state.tagsState.deleteTargetId,
    ),
  )
  const deleting = useAppSelector((state) => state.tagsState.deleting)

  const close = () => dispatch(actions.deleteTargetChanged(null))

  async function confirm() {
    if (!target) return
    dispatch(actions.deletingChanged(true))
    const result = await deleteTag({ id: target.id })
    dispatch(actions.deletingChanged(false))
    if (result.statusCode !== 200) {
      toast.error(result.message)
      return
    }
    dispatch(actions.tagRemoved(target.id))
    close()
    toast.success(`Deleted ${target.name}.`)
  }

  return (
    <Modal
      open={!!target}
      title='Delete tag?'
      onClose={close}
      footer={
        <>
          <Button variant='outline' onClick={close}>
            Cancel
          </Button>
          <Button variant='destructive' disabled={deleting} onClick={confirm}>
            {deleting ? 'Deleting…' : 'Delete'}
          </Button>
        </>
      }
    >
      <p>
        <strong>{target?.name}</strong> will be removed from{' '}
        {target?.postCount ?? 0} post(s).
      </p>
    </Modal>
  )
}
