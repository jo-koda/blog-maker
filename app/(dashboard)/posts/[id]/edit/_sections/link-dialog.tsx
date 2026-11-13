'use client'

import { FormEvent, useState } from 'react'
import { Editor } from '@tiptap/react'
import { Modal } from '@/components/modal'
import { Button } from '@/components/ui/button'
import { Field } from '@/components/ui/field'
import { Input } from '@/components/ui/input'

function LinkForm({
  editor,
  onClose,
}: {
  editor: Editor
  onClose: () => void
}) {
  const current = editor.getAttributes('link').href as string | undefined
  const [href, setHref] = useState(current ?? '')

  function submit(event: FormEvent) {
    event.preventDefault()
    const url = href.trim()
    const chain = editor.chain().focus().extendMarkRange('link')
    if (url) {
      chain.setLink({ href: url }).run()
    } else {
      chain.unsetLink().run()
    }
    onClose()
  }

  return (
    <form onSubmit={submit} className='flex flex-col gap-4'>
      <Field
        label='URL'
        htmlFor='link-href'
        hint='Leave empty to remove the link.'
      >
        <Input
          id='link-href'
          autoFocus
          value={href}
          onChange={(event) => setHref(event.target.value)}
          placeholder='https://example.com'
        />
      </Field>
      <div className='flex justify-end gap-2'>
        <Button variant='outline' onClick={onClose}>
          Cancel
        </Button>
        <Button type='submit'>{current ? 'Update link' : 'Add link'}</Button>
      </div>
    </form>
  )
}

export default function LinkDialog({
  editor,
  open,
  onClose,
}: {
  editor: Editor
  open: boolean
  onClose: () => void
}) {
  return (
    <Modal open={open} title='Link' onClose={onClose}>
      {open && <LinkForm editor={editor} onClose={onClose} />}
    </Modal>
  )
}
