'use server'

import { auth } from '@/auth'
import { MAX_UPLOAD_BYTES, UPLOAD_IMAGE_TYPES } from '@/lib/blog/constants'
import { upload } from '@/services/media-service'
import { Result } from '@/models/result'

export async function uploadImage(
  formData: FormData,
): Promise<Result<{ id: string; url: string }>> {
  const session = await auth()
  if (!session) return { statusCode: 401, message: 'Not authenticated.' }

  const file = formData.get('file')
  const alt = String(formData.get('alt') ?? '').trim()

  if (!(file instanceof File) || file.size === 0) {
    return { statusCode: 422, message: 'Choose an image to upload.' }
  }
  const extension = UPLOAD_IMAGE_TYPES[file.type]
  if (!extension) {
    return {
      statusCode: 422,
      message: 'Upload a JPEG, PNG, WebP, GIF, or AVIF image.',
    }
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    return {
      statusCode: 413,
      message: `Images must be under ${MAX_UPLOAD_BYTES / 1024 / 1024} MB.`,
    }
  }

  try {
    const media = await upload({
      body: new Uint8Array(await file.arrayBuffer()),
      mimeType: file.type,
      extension,
      alt: alt || null,
    })
    return { data: { id: media.id, url: media.url }, statusCode: 201 }
  } catch {
    return { statusCode: 500, message: 'Could not upload the image.' }
  }
}
