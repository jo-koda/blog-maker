import { getTags } from '@/actions/api-actions/tag-action'
import { PageHeader } from '@/components/page-header'
import DeleteTagDialog from './delete-tag-dialog'
import Provider from './provider'
import TagForm from './tag-form'
import TagsTable from './tags-table'

export default async function TagsView() {
  const tags = await getTags()

  return (
    <Provider tags={tags}>
      <div className='flex flex-col gap-4'>
        <PageHeader
          title='Tags'
          description='Flat labels that cut across categories. Tags can also be created from the editor.'
        />
        <div className='grid items-start gap-4 lg:grid-cols-[320px_minmax(0,1fr)]'>
          <TagForm />
          <TagsTable />
        </div>
      </div>
      <DeleteTagDialog />
    </Provider>
  )
}
