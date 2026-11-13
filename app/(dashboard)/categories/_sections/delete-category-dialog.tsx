'use client'

import { toast } from 'sonner'
import { Modal } from '@/components/modal'
import { Button } from '@/components/ui/button'
import { useAppDispatch, useAppSelector } from '@/hooks/hooks'
import {
  deleteCategory,
  getCategories,
} from '@/actions/api-actions/category-action'
import { categoriesSlice } from '../_redux/categories-slice'

const actions = categoriesSlice.actions

export default function DeleteCategoryDialog() {
  const dispatch = useAppDispatch()
  const target = useAppSelector((state) =>
    state.categoriesState.categories.find(
      (category) => category.id === state.categoriesState.deleteTargetId,
    ),
  )
  const deleting = useAppSelector((state) => state.categoriesState.deleting)

  const close = () => dispatch(actions.deleteTargetChanged(null))

  async function confirm() {
    if (!target) return
    dispatch(actions.deletingChanged(true))
    const result = await deleteCategory({ id: target.id })
    if (result.statusCode !== 200) {
      dispatch(actions.deletingChanged(false))
      toast.error(result.message)
      return
    }
    const refreshed = await getCategories()
    dispatch(actions.categoriesLoaded(refreshed.data ?? []))
    dispatch(actions.deletingChanged(false))
    close()
    toast.success(`Deleted ${target.name}.`)
  }

  return (
    <Modal
      open={!!target}
      title='Delete category?'
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
        <strong>{target?.name}</strong> will be removed. Its{' '}
        {target?.postCount ?? 0} post(s) become uncategorized and any
        subcategories move to the top level.
      </p>
    </Modal>
  )
}
