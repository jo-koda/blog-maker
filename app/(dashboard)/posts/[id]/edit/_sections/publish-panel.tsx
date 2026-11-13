'use client'

import { useMemo } from 'react'
import { StatusBadge } from '@/components/status-badge'
import { Field } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { useAppDispatch, useAppSelector } from '@/hooks/hooks'
import { countWords, readingTime } from '@/lib/blog/content'
import { formatDate } from '@/lib/blog/format'
import Panel from '../_components/panel'
import { isFuture } from '../_redux/post-editor-query'
import { postEditorSlice } from '../_redux/post-editor-slice'

const actions = postEditorSlice.actions

export default function PublishPanel() {
  const dispatch = useAppDispatch()
  const values = useAppSelector((state) => state.postEditorState.values)
  const errors = useAppSelector((state) => state.postEditorState.errors)
  const persistedStatus = useAppSelector(
    (state) => state.postEditorState.persistedStatus,
  )
  const savedAt = useAppSelector((state) => state.postEditorState.savedAt)

  const stats = useMemo(
    () => ({
      words: countWords(values.contentJson),
      minutes: readingTime(values.contentJson),
    }),
    [values.contentJson],
  )

  return (
    <Panel title='Publish'>
      <dl className='grid grid-cols-[auto_1fr] items-center gap-x-4 gap-y-2 text-sm'>
        <dt className='text-muted-foreground'>Status</dt>
        <dd>
          {persistedStatus ? (
            <StatusBadge status={persistedStatus} />
          ) : (
            <span className='text-muted-foreground'>Not saved yet</span>
          )}
        </dd>
        <dt className='text-muted-foreground'>Last saved</dt>
        <dd>{formatDate(savedAt)}</dd>
        <dt className='text-muted-foreground'>Length</dt>
        <dd>
          {stats.words} words · {stats.minutes} min read
        </dd>
      </dl>

      <Field
        label='Schedule'
        htmlFor='post-schedule'
        error={errors.scheduledAt}
        hint={
          isFuture(values.scheduledAt)
            ? 'The post goes live at this time.'
            : 'Leave empty to publish immediately.'
        }
      >
        <div className='flex gap-2'>
          <Input
            id='post-schedule'
            type='datetime-local'
            value={values.scheduledAt}
            aria-invalid={!!errors.scheduledAt}
            onChange={(event) =>
              dispatch(
                actions.valueChanged({
                  key: 'scheduledAt',
                  value: event.target.value,
                }),
              )
            }
          />
          {values.scheduledAt && (
            <button
              type='button'
              onClick={() =>
                dispatch(
                  actions.valueChanged({ key: 'scheduledAt', value: '' }),
                )
              }
              className='text-muted-foreground hover:text-foreground cursor-pointer text-xs'
            >
              Clear
            </button>
          )}
        </div>
      </Field>

      <Field
        label='URL slug'
        htmlFor='post-slug'
        error={errors.slug}
        hint={`/blog/${values.slug || 'your-post-title'}`}
      >
        <Input
          id='post-slug'
          value={values.slug}
          aria-invalid={!!errors.slug}
          onChange={(event) =>
            dispatch(actions.slugChanged(event.target.value))
          }
        />
      </Field>

      <label className='flex cursor-pointer items-center gap-2 text-sm'>
        <input
          type='checkbox'
          checked={values.allowComments}
          onChange={(event) =>
            dispatch(
              actions.valueChanged({
                key: 'allowComments',
                value: event.target.checked,
              }),
            )
          }
          className='accent-primary size-4'
        />
        Allow comments
      </label>
    </Panel>
  )
}
