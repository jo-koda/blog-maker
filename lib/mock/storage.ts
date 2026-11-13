import 'server-only'

// In-memory stand-in for an object store (S3, R2, Vercel Blob). Uploaded
// files are served by app/media/[...key]/route.ts and reset on restart,
// like the rest of the mock data.

interface StoredFile {
  body: Uint8Array
  contentType: string
}

const globalForStorage = globalThis as unknown as {
  mockStorage?: Map<string, StoredFile>
}

const files = globalForStorage.mockStorage ?? new Map<string, StoredFile>()
globalForStorage.mockStorage = files

export const MEDIA_PATH = '/media'

export async function putObject(key: string, file: StoredFile) {
  files.set(key, file)
  return `${MEDIA_PATH}/${key}`
}

export async function getObject(key: string) {
  return files.get(key) ?? null
}
