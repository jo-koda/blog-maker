import { notFound } from 'next/navigation'
import { getPost } from '@/actions/api-actions/post-action'
import { getCategories } from '@/actions/api-actions/category-action'
import { getTags } from '@/actions/api-actions/tag-action'
import ContentEditor from './content-editor'
import CoverPanel from './cover-panel'
import EditorHeader from './editor-header'
import Provider from './provider'
import PublishPanel from './publish-panel'
import SeoPanel from './seo-panel'
import TaxonomyPanel from './taxonomy-panel'
import TitleField from './title-field'

export default async function EditorView({ id }: { id: string | null }) {
  const [post, categories, tags] = await Promise.all([
    id ? getPost({ id }) : null,
    getCategories(),
    getTags(),
  ])

  if (post && !post.data) notFound()

  return (
    <Provider post={post?.data ?? null} categories={categories} tags={tags}>
      <div className='flex flex-col gap-4'>
        <EditorHeader />
        <div className='grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_320px]'>
          <div className='bg-card min-w-0 rounded-xl border'>
            <TitleField />
            <ContentEditor />
          </div>
          <aside className='flex flex-col gap-4 lg:sticky lg:top-6'>
            <PublishPanel />
            <TaxonomyPanel />
            <CoverPanel />
            <SeoPanel />
          </aside>
        </div>
      </div>
    </Provider>
  )
}
