'use client'

import { FormEvent, useState } from 'react'
import { isValidAudioUrl } from '@tiptap/extension-audio'
import { isValidTwitchUrl } from '@tiptap/extension-twitch'
import { isValidYoutubeUrl } from '@tiptap/extension-youtube'
import { Editor } from '@tiptap/react'
import { Modal } from '@/components/modal'
import { Button } from '@/components/ui/button'
import { Field } from '@/components/ui/field'
import { Input } from '@/components/ui/input'

type EmbedKind = 'youtube' | 'twitch' | 'audio'

const KIND_LABEL: Record<EmbedKind, string> = {
  youtube: 'YouTube video',
  twitch: 'Twitch video or clip',
  audio: 'Audio file',
}

function detect(url: string): EmbedKind | null {
  if (!/^https:\/\/\S+$/.test(url)) return null
  if (isValidYoutubeUrl(url)) return 'youtube'
  if (isValidTwitchUrl(url)) return 'twitch'
  if (isValidAudioUrl(url)) return 'audio'
  return null
}

function EmbedForm({
  editor,
  onClose,
}: {
  editor: Editor
  onClose: () => void
}) {
  const [url, setUrl] = useState('')
  const [error, setError] = useState<string>()
  const kind = detect(url.trim())

  function submit(event: FormEvent) {
    event.preventDefault()
    const src = url.trim()
    if (!kind) {
      setError('Paste an https YouTube, Twitch, or audio (.mp3, .ogg) link.')
      return
    }

    const chain = editor.chain().focus()
    if (kind === 'youtube') chain.setYoutubeVideo({ src }).run()
    if (kind === 'twitch') chain.setTwitchVideo({ src }).run()
    if (kind === 'audio') chain.setAudio({ src, controls: true }).run()
    onClose()
  }

  return (
    <form onSubmit={submit} noValidate className='flex flex-col gap-4'>
      <Field
        label='Link'
        htmlFor='embed-url'
        error={error}
        hint={
          kind
            ? `Detected: ${KIND_LABEL[kind]}`
            : 'YouTube, Twitch, or a direct link to an audio file.'
        }
      >
        <Input
          id='embed-url'
          autoFocus
          value={url}
          aria-invalid={!!error}
          onChange={(event) => {
            setUrl(event.target.value)
            setError(undefined)
          }}
          placeholder='https://www.youtube.com/watch?v=…'
        />
      </Field>
      <div className='flex justify-end gap-2'>
        <Button variant='outline' onClick={onClose}>
          Cancel
        </Button>
        <Button type='submit'>Embed</Button>
      </div>
    </form>
  )
}

export default function EmbedDialog({
  editor,
  open,
  onClose,
}: {
  editor: Editor
  open: boolean
  onClose: () => void
}) {
  return (
    <Modal open={open} title='Embed media' onClose={onClose}>
      {open && <EmbedForm editor={editor} onClose={onClose} />}
    </Modal>
  )
}
