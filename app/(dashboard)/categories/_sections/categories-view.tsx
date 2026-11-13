import { getCategories } from '@/actions/api-actions/category-action'
import { PageHeader } from '@/components/page-header'
import CategoriesTable from './categories-table'
import CategoryForm from './category-form'
import DeleteCategoryDialog from './delete-category-dialog'
import Provider from './provider'

export default async function CategoriesView() {
  const categories = await getCategories()

  return (
    <Provider categories={categories}>
      <div className='flex flex-col gap-4'>
        <PageHeader
          title='Categories'
          description='Group posts by topic. Each post has one primary category.'
        />
        <div className='grid items-start gap-4 lg:grid-cols-[320px_minmax(0,1fr)]'>
          <CategoryForm />
          <CategoriesTable />
        </div>
      </div>
      <DeleteCategoryDialog />
    </Provider>
  )
}
