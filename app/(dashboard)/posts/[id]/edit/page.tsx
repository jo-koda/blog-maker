import { Metadata } from 'next'
import { Suspense } from 'react'
import Loading from './loading'
import EditorView from './_sections/editor-view'

export const metadata: Metadata = {
  title: 'Edit post',
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  return (
    <Suspense fallback={<Loading />}>
      <EditorView id={id} />
    </Suspense>
  )
}
