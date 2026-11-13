'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  Check,
  CircleAlert,
  Eye,
  Globe,
  Loader2,
} from 'lucide-react'
import { Button, buttonVariants } from '@/components/ui/button'
import { useAppSelector, useAppStore } from '@/hooks/hooks'
import { formatTime } from '@/lib/blog/format'
import { PostStatus } from '@/models/post'
import { useAutosave, usePostSave } from '../_components/use-post-save'
import { publishIntent } from '../_redux/post-editor-query'

function SaveIndicator() {
  const saveStatus = useAppSelector((state) => state.postEditorState.saveStatus)
  const savedAt = useAppSelector((state) => state.postEditorState.savedAt)

  if (saveStatus === 'saving') {
    return (
      <span className='text-muted-foreground flex items-center gap-1.5 text-xs'>
        <Loader2 className='size-3.5 animate-spin' />
        Saving…
      </span>
    )
  }
  if (saveStatus === 'error') {
    return (
      <span className='text-destructive flex items-center gap-1.5 text-xs'>
        <CircleAlert className='size-3.5' />
        Not saved — check the highlighted fields
      </span>
    )
  }
  if (saveStatus === 'dirty') {
    return (
      <span className='text-muted-foreground text-xs'>Unsaved changes</span>
    )
  }
  if (saveStatus === 'saved' && savedAt) {
    return (
      <span className='text-muted-foreground flex items-center gap-1.5 text-xs'>
        <Check className='size-3.5' />
        Saved at {formatTime(savedAt)}
      </span>
    )
  }
  return null
}

function primaryLabel(persisted: PostStatus | null, intent: PostStatus) {
  if (intent === 'SCHEDULED') {
    return persisted === 'SCHEDULED' ? 'Update schedule' : 'Schedule'
  }
  return persisted === 'PUBLISHED' ? 'Update' : 'Publish'
}

export default function EditorHeader() {
  const store = useAppStore()
  const save = usePostSave()
  useAutosave()

  const postId = useAppSelector((state) => state.postEditorState.postId)
  const persistedSlug = useAppSelector(
    (state) => state.postEditorState.persistedSlug,
  )
  const persistedStatus = useAppSelector(
    (state) => state.postEditorState.persistedStatus,
  )
  const saving = useAppSelector(
    (state) => state.postEditorState.saveStatus === 'saving',
  )
  const intent = useAppSelector((state) =>
    publishIntent(state.postEditorState.values),
  )

  const live =
    persistedStatus === 'PUBLISHED' || persistedStatus === 'SCHEDULED'

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key === 's') {
        event.preventDefault()
        const { persistedStatus, values } = store.getState().postEditorState
        save(
          persistedStatus === 'PUBLISHED' || persistedStatus === 'SCHEDULED'
            ? publishIntent(values)
            : 'DRAFT',
        )
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [save, store])

  return (
    <div className='flex flex-wrap items-center justify-between gap-3'>
      <div className='flex items-center gap-3'>
        <Link
          href='/posts'
          className={buttonVariants({ variant: 'ghost', size: 'sm' })}
        >
          <ArrowLeft />
          Posts
        </Link>
        <SaveIndicator />
      </div>

      <div className='flex flex-wrap items-center gap-2'>
        {persistedStatus === 'PUBLISHED' && persistedSlug ? (
          <Link
            href={`/blog/${persistedSlug}`}
            target='_blank'
            className={buttonVariants({ variant: 'ghost' })}
          >
            <Globe />
            View
          </Link>
        ) : (
          postId && (
            <Link
              href={`/posts/${postId}/preview`}
              target='_blank'
              className={buttonVariants({ variant: 'ghost' })}
            >
              <Eye />
              Preview
            </Link>
          )
        )}
        <Button
          variant='outline'
          disabled={saving}
          onClick={() => save('DRAFT')}
        >
          {live ? 'Switch to draft' : 'Save draft'}
        </Button>
        <Button disabled={saving} onClick={() => save(intent)}>
          {primaryLabel(persistedStatus, intent)}
        </Button>
      </div>
    </div>
  )
}
