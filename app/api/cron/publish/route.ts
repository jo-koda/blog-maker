import { NextRequest, NextResponse } from 'next/server'
import { publishDuePosts } from '@/lib/blog/scheduler'

export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET
  if (!secret || request.headers.get('authorization') !== `Bearer ${secret}`) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  const published = await publishDuePosts()
  return NextResponse.json({ published })
}
