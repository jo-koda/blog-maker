import Link from 'next/link'
import { Plus } from 'lucide-react'
import { PageHeader } from '@/components/page-header'
import { buttonVariants } from '@/components/ui/button'

export default function Header() {
  return (
    <PageHeader
      title='Posts'
      description='Write, schedule, and publish posts for the blog.'
      actions={
        <Link href='/posts/new' className={buttonVariants()}>
          <Plus />
          New post
        </Link>
      }
    />
  )
}
