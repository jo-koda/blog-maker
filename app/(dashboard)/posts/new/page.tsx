import { Metadata } from 'next'
import { Suspense } from 'react'
import Loading from '../[id]/edit/loading'
import EditorView from '../[id]/edit/_sections/editor-view'

export const metadata: Metadata = {
  title: 'New post',
}

export default function Page() {
  return (
    <Suspense fallback={<Loading />}>
      <EditorView id={null} />
    </Suspense>
  )
}
