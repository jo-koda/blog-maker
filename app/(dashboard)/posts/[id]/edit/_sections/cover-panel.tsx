'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import { Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Field } from '@/components/ui/field'
import { Input, Textarea } from '@/components/ui/input'
import { useAppDispatch, useAppSelector } from '@/hooks/hooks'
import { isImageSrc } from '@/lib/blog/validation'
import Panel from '../_components/panel'
import {
  IMAGE_ACCEPT,
  altFromFileName,
  useImageUpload,
} from '../_components/use-image-upload'
import { postEditorSlice } from '../_redux/post-editor-slice'

const actions = postEditorSlice.actions

export default function CoverPanel() {
  const dispatch = useAppDispatch()
  const values = useAppSelector((state) => state.postEditorState.values)
  const errors = useAppSelector((state) => state.postEditorState.errors)
  const upload = useImageUpload()
  const fileRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)

  async function onFile(file: File | undefined) {
    if (!file) return
    const alt = values.coverImageAlt.trim() || altFromFileName(file.name)
    setUploading(true)
    const url = await upload(file, alt)
    setUploading(false)
    if (fileRef.current) fileRef.current.value = ''
    if (!url) return
    dispatch(actions.valueChanged({ key: 'coverImageUrl', value: url }))
    dispatch(actions.valueChanged({ key: 'coverImageAlt', value: alt }))
  }

  return (
    <Panel title='Cover & excerpt'>
      {isImageSrc(values.coverImageUrl) && (
        <div className='bg-muted relative aspect-video overflow-hidden rounded-lg'>
          <Image
            src={values.coverImageUrl}
            alt={values.coverImageAlt}
            fill
            unoptimized
            sizes='320px'
            className='object-cover'
          />
        </div>
      )}
      <Field
        label='Cover image'
        htmlFor='post-cover-url'
        error={errors.coverImageUrl}
        hint='Upload an image or paste a URL.'
      >
        <div className='flex gap-2'>
          <Input
            id='post-cover-url'
            value={values.coverImageUrl}
            aria-invalid={!!errors.coverImageUrl}
            placeholder='https://…'
            onChange={(event) =>
              dispatch(
                actions.valueChanged({
                  key: 'coverImageUrl',
                  value: event.target.value.trim(),
                }),
              )
            }
          />
          <input
            ref={fileRef}
            type='file'
            accept={IMAGE_ACCEPT}
            className='sr-only'
            tabIndex={-1}
            aria-hidden
            onChange={(event) => onFile(event.target.files?.[0])}
          />
          <Button
            variant='outline'
            size='icon'
            className='size-[38px] shrink-0'
            title='Upload cover image'
            aria-label='Upload cover image'
            disabled={uploading}
            onClick={() => fileRef.current?.click()}
          >
            <Upload />
          </Button>
        </div>
      </Field>
      {values.coverImageUrl && (
        <Field
          label='Cover alt text'
          htmlFor='post-cover-alt'
          error={errors.coverImageAlt}
        >
          <Input
            id='post-cover-alt'
            value={values.coverImageAlt}
            aria-invalid={!!errors.coverImageAlt}
            onChange={(event) =>
              dispatch(
                actions.valueChanged({
                  key: 'coverImageAlt',
                  value: event.target.value,
                }),
              )
            }
          />
        </Field>
      )}
      <Field
        label='Excerpt'
        htmlFor='post-excerpt'
        error={errors.excerpt}
        hint={`${values.excerpt.length}/500 · Shown on post cards and in search results.`}
      >
        <Textarea
          id='post-excerpt'
          rows={3}
          value={values.excerpt}
          aria-invalid={!!errors.excerpt}
          onChange={(event) =>
            dispatch(
              actions.valueChanged({
                key: 'excerpt',
                value: event.target.value,
              }),
            )
          }
        />
      </Field>
    </Panel>
  )
}
