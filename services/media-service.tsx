import 'server-only'

import { MediaRecord, cuid, db } from '@/lib/mock/db'
import { putObject } from '@/lib/mock/storage'

export async function show({ id }: { id: string }) {
  return db.media.find((media) => media.id === id) ?? null
}

export async function store({ url, alt }: { url: string; alt: string }) {
  const media: MediaRecord = {
    id: cuid(),
    key: url,
    url,
    mimeType: 'image/*',
    size: 0,
    width: null,
    height: null,
    alt,
    createdAt: new Date(),
  }
  db.media.push(media)
  return media
}

export async function upload({
  body,
  mimeType,
  extension,
  alt,
}: {
  body: Uint8Array
  mimeType: string
  extension: string
  alt: string | null
}) {
  const id = cuid()
  const now = new Date()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const key = `blog/${now.getFullYear()}/${month}/${id}.${extension}`
  const url = await putObject(key, { body, contentType: mimeType })

  const media: MediaRecord = {
    id,
    key,
    url,
    mimeType,
    size: body.byteLength,
    width: null,
    height: null,
    alt,
    createdAt: now,
  }
  db.media.push(media)
  return media
}
