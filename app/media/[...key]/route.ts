import { getObject } from '@/lib/mock/storage'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ key: string[] }> },
) {
  const { key } = await params
  const file = await getObject(key.join('/'))
  if (!file) return new Response('Not found', { status: 404 })

  return new Response(file.body as BodyInit, {
    headers: {
      'Content-Type': file.contentType,
      'Cache-Control': 'public, max-age=31536000, immutable',
      'X-Content-Type-Options': 'nosniff',
    },
  })
}
