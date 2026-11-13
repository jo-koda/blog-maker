'use client'

import { Editor, useEditorState } from '@tiptap/react'
import { Pilcrow } from 'lucide-react'
import { WORDS_PER_MINUTE } from '@/lib/blog/constants'
import { cn } from '@/lib/utils'

export default function EditorFooter({ editor }: { editor: Editor }) {
  const state = useEditorState({
    editor,
    selector: ({ editor }) => ({
      words: editor.storage.characterCount.words() as number,
      characters: editor.storage.characterCount.characters() as number,
      invisible: editor.storage.invisibleCharacters.visibility() as boolean,
    }),
  })

  return (
    <div className='text-muted-foreground flex items-center justify-between gap-3 border-t px-4 py-2 text-xs md:px-6'>
      <span aria-live='polite'>
        {state.words.toLocaleString()} words ·{' '}
        {state.characters.toLocaleString()} characters ·{' '}
        {Math.max(1, Math.ceil(state.words / WORDS_PER_MINUTE))} min read
      </span>
      <button
        type='button'
        aria-pressed={state.invisible}
        onClick={() => editor.chain().focus().toggleInvisibleCharacters().run()}
        className={cn(
          'hover:bg-muted flex cursor-pointer items-center gap-1 rounded-md px-2 py-1 transition-colors',
          state.invisible && 'text-primary bg-accent',
        )}
      >
        <Pilcrow className='size-3.5' />
        Formatting marks
      </button>
    </div>
  )
}
