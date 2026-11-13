import { ReactNode } from 'react'
import Link from 'next/link'

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className='bg-card min-h-screen'>
      <header className='border-b'>
        <div className='mx-auto flex max-w-3xl items-center justify-between px-4 py-4'>
          <Link href='/blog' className='font-serif text-xl font-semibold'>
            The Blog
          </Link>
          <Link
            href='/posts'
            className='text-muted-foreground hover:text-foreground text-sm'
          >
            Dashboard
          </Link>
        </div>
      </header>
      <main className='mx-auto max-w-3xl px-4 py-10'>{children}</main>
    </div>
  )
}
