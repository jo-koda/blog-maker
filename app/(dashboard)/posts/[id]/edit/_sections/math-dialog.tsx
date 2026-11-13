'use client'

import { FormEvent, useMemo, useState } from 'react'
import { Editor } from '@tiptap/react'
import katex from 'katex'
import { Modal } from '@/components/modal'
import { Button } from '@/components/ui/button'
import { Field } from '@/components/ui/field'
import { Textarea } from '@/components/ui/input'
import { MathMode } from './editor-toolbar'

export interface MathTarget {
  mode: MathMode
  latex: string
  pos: number | null
}

function MathForm({
  editor,
  target,
  onClose,
}: {
  editor: Editor
  target: MathTarget
  onClose: () => void
}) {
  const [latex, setLatex] = useState(target.latex)
  const editing = target.pos !== null

  const preview = useMemo(
    () =>
      latex.trim()
        ? katex.renderToString(latex, {
            displayMode: target.mode === 'block',
            throwOnError: false,
          })
        : '',
    [latex, target.mode],
  )

  function submit(event: FormEvent) {
    event.preventDefault()
    const value = latex.trim()
    const chain = editor.chain().focus()
    const pos = target.pos ?? undefined

    if (!value) {
      if (editing && target.mode === 'inline') chain.deleteInlineMath({ pos })
      if (editing && target.mode === 'block') chain.deleteBlockMath({ pos })
      chain.run()
      onClose()
      return
    }

    if (target.mode === 'inline') {
      if (editing) chain.updateInlineMath({ latex: value, pos })
      else chain.insertInlineMath({ latex: value })
    } else {
      if (editing) chain.updateBlockMath({ latex: value, pos })
      else chain.insertBlockMath({ latex: value })
    }
    chain.run()
    onClose()
  }

  return (
    <form onSubmit={submit} className='flex flex-col gap-4'>
      <Field
        label='LaTeX'
        htmlFor='math-latex'
        hint={editing ? 'Clear the field to remove the formula.' : undefined}
      >
        <Textarea
          id='math-latex'
          autoFocus
          rows={3}
          value={latex}
          spellCheck={false}
          className='font-mono'
          placeholder='E = mc^2'
          onChange={(event) => setLatex(event.target.value)}
        />
      </Field>
      <div
        aria-live='polite'
        className='bg-muted grid min-h-16 place-items-center overflow-x-auto rounded-lg px-3 py-4'
      >
        {preview ? (
          <span dangerouslySetInnerHTML={{ __html: preview }} />
        ) : (
          <span className='text-muted-foreground text-sm'>Preview</span>
        )}
      </div>
      <div className='flex justify-end gap-2'>
        <Button variant='outline' onClick={onClose}>
          Cancel
        </Button>
        <Button type='submit'>{editing ? 'Update' : 'Insert'}</Button>
      </div>
    </form>
  )
}

export default function MathDialog({
  editor,
  target,
  onClose,
}: {
  editor: Editor
  target: MathTarget | null
  onClose: () => void
}) {
  return (
    <Modal
      open={!!target}
      title={target?.mode === 'block' ? 'Math block' : 'Inline math'}
      onClose={onClose}
    >
      {target && <MathForm editor={editor} target={target} onClose={onClose} />}
    </Modal>
  )
}
