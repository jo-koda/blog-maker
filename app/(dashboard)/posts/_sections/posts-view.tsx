import { getPosts } from '@/actions/api-actions/post-action'
import DeletePostDialog from './delete-post-dialog'
import Header from './header'
import PaginationBar from './pagination-bar'
import PostsTable from './posts-table'
import Provider from './provider'
import Toolbar from './toolbar'

export default async function PostsView() {
  const posts = await getPosts()

  return (
    <Provider posts={posts}>
      <div className='flex flex-col gap-4'>
        <Header />
        <Toolbar />
        <PostsTable />
        <PaginationBar />
      </div>
      <DeletePostDialog />
    </Provider>
  )
}
