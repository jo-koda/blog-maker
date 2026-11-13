'use client'

import { useCallback } from 'react'
import { toast } from 'sonner'
import { uploadImage } from '@/actions/api-actions/media-action'
import { MAX_UPLOAD_BYTES, UPLOAD_IMAGE_TYPES } from '@/lib/blog/constants'

export const IMAGE_ACCEPT = Object.keys(UPLOAD_IMAGE_TYPES).join(',')

export function altFromFileName(name: string) {
  return name
    .replace(/\.[^.]+$/, '')
    .replace(/[-_]+/g, ' ')
    .trim()
}

export function useImageUpload() {
  return useCallback(async (file: File, alt: string) => {
    if (!UPLOAD_IMAGE_TYPES[file.type]) {
      toast.error('Upload a JPEG, PNG, WebP, GIF, or AVIF image.')
      return null
    }
    if (file.size > MAX_UPLOAD_BYTES) {
      toast.error(`Images must be under ${MAX_UPLOAD_BYTES / 1024 / 1024} MB.`)
      return null
    }

    const formData = new FormData()
    formData.set('file', file)
    formData.set('alt', alt)
    const result = await uploadImage(formData)
    if (!result.data) {
      toast.error(result.message ?? 'Could not upload the image.')
      return null
    }
    return result.data.url
  }, [])
}
