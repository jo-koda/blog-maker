'use client'

import { DragEvent, FormEvent, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { Editor } from '@tiptap/react'
import { Upload } from 'lucide-react'
import { Modal } from '@/components/modal'
import { Button } from '@/components/ui/button'
import { Field } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import {
  IMAGE_ACCEPT,
  altFromFileName,
  useImageUpload,
} from '../_components/use-image-upload'

type Source = 'upload' | 'url'

function ImageForm({
  editor,
  onClose,
}: {
  editor: Editor
  onClose: () => void
}) {
  const upload = useImageUpload()
  const inputRef = useRef<HTMLInputElement>(null)
  const [source, setSource] = useState<Source>('upload')
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [dragging, setDragging] = useState(false)
  const [src, setSrc] = useState('')
  const [alt, setAlt] = useState('')
  const [pending, setPending] = useState(false)
  const [errors, setErrors] = useState<{
    file?: string
    src?: string
    alt?: string
  }>({})

  useEffect(
    () => () => {
      if (preview) URL.revokeObjectURL(preview)
    },
    [preview],
  )

  function pick(next: File | undefined) {
    if (!next) return
    setFile(next)
    setPreview(URL.createObjectURL(next))
    if (!alt) setAlt(altFromFileName(next.name))
    setErrors((current) => ({ ...current, file: undefined }))
  }

  function onDrop(event: DragEvent) {
    event.preventDefault()
    setDragging(false)
    pick(event.dataTransfer.files[0])
  }

  async function submit(event: FormEvent) {
    event.preventDefault()
    const next: typeof errors = {}
    if (source === 'upload' && !file) next.file = 'Choose an image to upload.'
    if (source === 'url' && !/^https?:\/\/\S+$/.test(src.trim())) {
      next.src = 'Enter a full http(s) image URL.'
    }
    if (!alt.trim()) next.alt = 'Alt text is required for accessibility.'
    setErrors(next)
    if (Object.keys(next).length > 0) return

    let url = src.trim()
    if (source === 'upload' && file) {
      setPending(true)
      const uploaded = await upload(file, alt.trim())
      setPending(false)
      if (!uploaded) return
      url = uploaded
    }

    editor.chain().focus().setImage({ src: url, alt: alt.trim() }).run()
    onClose()
  }

  return (
    <form onSubmit={submit} noValidate className='flex flex-col gap-4'>
      <div role='tablist' className='bg-muted flex gap-1 rounded-lg p-1'>
        {(['upload', 'url'] as const).map((value) => (
          <button
            key={value}
            type='button'
            role='tab'
            aria-selected={source === value}
            onClick={() => setSource(value)}
            className={cn(
              'flex-1 cursor-pointer rounded-md py-1.5 text-sm font-medium transition-colors',
              source === value
                ? 'bg-card text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            {value === 'upload' ? 'Upload' : 'From URL'}
          </button>
        ))}
      </div>

      {source === 'upload' ? (
        <Field label='Image' htmlFor='image-file' error={errors.file}>
          <input
            ref={inputRef}
            id='image-file'
            type='file'
            accept={IMAGE_ACCEPT}
            className='sr-only'
            onChange={(event) => pick(event.target.files?.[0])}
          />
          <button
            type='button'
            onClick={() => inputRef.current?.click()}
            onDragOver={(event) => {
              event.preventDefault()
              setDragging(true)
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
            className={cn(
              'hover:bg-muted flex min-h-40 w-full cursor-pointer flex-col items-center justify-center gap-2 overflow-hidden rounded-lg border-2 border-dashed p-4 text-sm transition-colors',
              dragging && 'border-primary bg-accent',
              errors.file && 'border-destructive',
            )}
          >
            {preview ? (
              <span className='relative block h-40 w-full'>
                <Image
                  src={preview}
                  alt=''
                  fill
                  unoptimized
                  className='rounded-md object-contain'
                />
              </span>
            ) : (
              <>
                <Upload className='text-muted-foreground size-6' />
                <span className='font-medium'>
                  Drop an image or click to browse
                </span>
                <span className='text-muted-foreground text-xs'>
                  JPEG, PNG, WebP, GIF, or AVIF up to 5 MB
                </span>
              </>
            )}
          </button>
          {file && (
            <p className='text-muted-foreground truncate text-xs'>
              {file.name}
            </p>
          )}
        </Field>
      ) : (
        <Field label='Image URL' htmlFor='image-src' error={errors.src}>
          <Input
            id='image-src'
            autoFocus
            value={src}
            aria-invalid={!!errors.src}
            onChange={(event) => setSrc(event.target.value)}
            placeholder='https://images.example.com/photo.jpg'
          />
        </Field>
      )}

      <Field
        label='Alt text'
        htmlFor='image-alt'
        error={errors.alt}
        hint='Describe the image for readers who cannot see it.'
      >
        <Input
          id='image-alt'
          value={alt}
          aria-invalid={!!errors.alt}
          onChange={(event) => setAlt(event.target.value)}
        />
      </Field>
      <div className='flex justify-end gap-2'>
        <Button variant='outline' onClick={onClose}>
          Cancel
        </Button>
        <Button type='submit' disabled={pending}>
          {pending ? 'Uploading…' : 'Insert image'}
        </Button>
      </div>
    </form>
  )
}

export default function ImageDialog({
  editor,
  open,
  onClose,
}: {
  editor: Editor
  open: boolean
  onClose: () => void
}) {
  return (
    <Modal open={open} title='Insert image' onClose={onClose}>
      {open && <ImageForm editor={editor} onClose={onClose} />}
    </Modal>
  )
}
