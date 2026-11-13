'use client'

import { useCallback, useEffect } from 'react'
import { toast } from 'sonner'
import { useAppDispatch, useAppSelector, useAppStore } from '@/hooks/hooks'
import { savePost } from '@/actions/api-actions/post-action'
import { AUTOSAVE_DELAY_MS } from '@/lib/blog/constants'
import { isEmptyDoc } from '@/lib/blog/content'
import { PostStatus } from '@/models/post'
import { toPayload } from '../_redux/post-editor-query'
import { postEditorSlice } from '../_redux/post-editor-slice'

const actions = postEditorSlice.actions

const SUCCESS_MESSAGE: Record<PostStatus, string> = {
  DRAFT: 'Draft saved.',
  SCHEDULED: 'Post scheduled.',
  PUBLISHED: 'Post published.',
  ARCHIVED: 'Post archived.',
}

export function usePostSave() {
  const dispatch = useAppDispatch()
  const store = useAppStore()

  return useCallback(
    async (intent: PostStatus, { autosave = false } = {}) => {
      const state = store.getState().postEditorState
      if (state.saveStatus === 'saving') return

      const revision = state.revision
      dispatch(actions.saveStarted(intent))

      const result = await savePost({
        id: state.postId,
        values: toPayload(state.values),
        status: intent,
        autosave,
      })

      if (result.statusCode !== 200 || !result.data) {
        dispatch(actions.saveFailed(result.errors ?? {}))
        if (!autosave) toast.error(result.message ?? 'Could not save post.')
        return
      }

      if (!state.postId) {
        window.history.replaceState(null, '', `/posts/${result.data.id}/edit`)
      }
      dispatch(actions.saveSucceeded({ post: result.data, revision }))
      if (!autosave) toast.success(SUCCESS_MESSAGE[result.data.status])
    },
    [dispatch, store],
  )
}

export function useAutosave() {
  const store = useAppStore()
  const save = usePostSave()
  const revision = useAppSelector((state) => state.postEditorState.revision)
  const saveStatus = useAppSelector((state) => state.postEditorState.saveStatus)
  const persistedStatus = useAppSelector(
    (state) => state.postEditorState.persistedStatus,
  )

  useEffect(() => {
    if (saveStatus !== 'dirty') return
    if (persistedStatus && persistedStatus !== 'DRAFT') return

    const { values } = store.getState().postEditorState
    if (!values.title.trim() && isEmptyDoc(values.contentJson)) return

    const timer = setTimeout(
      () => save('DRAFT', { autosave: true }),
      AUTOSAVE_DELAY_MS,
    )
    return () => clearTimeout(timer)
  }, [revision, saveStatus, persistedStatus, save, store])

  useEffect(() => {
    if (saveStatus !== 'dirty' && saveStatus !== 'error') return
    function warn(event: BeforeUnloadEvent) {
      event.preventDefault()
    }
    window.addEventListener('beforeunload', warn)
    return () => window.removeEventListener('beforeunload', warn)
  }, [saveStatus])
}
