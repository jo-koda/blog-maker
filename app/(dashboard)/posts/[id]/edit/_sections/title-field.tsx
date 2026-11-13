'use client'

import { useAppDispatch, useAppSelector } from '@/hooks/hooks'
import { postEditorSlice } from '../_redux/post-editor-slice'

export default function TitleField() {
  const dispatch = useAppDispatch()
  const title = useAppSelector((state) => state.postEditorState.values.title)
  const error = useAppSelector((state) => state.postEditorState.errors.title)

  return (
    <div className='px-6 pt-8 pb-4 md:px-10'>
      <textarea
        rows={1}
        value={title}
        onChange={(event) =>
          dispatch(
            postEditorSlice.actions.titleChanged(
              event.target.value.replace(/\n/g, ' '),
            ),
          )
        }
        placeholder='Add title'
        aria-label='Title'
        aria-invalid={!!error}
        className='placeholder:text-muted-foreground/60 field-sizing-content w-full resize-none bg-transparent font-serif text-4xl leading-tight font-semibold outline-none'
      />
      {error && <p className='text-destructive mt-1 text-sm'>{error}</p>}
    </div>
  )
}
