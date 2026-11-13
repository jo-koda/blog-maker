'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ExternalLink, FileText, Folder, PenSquare, Tag } from 'lucide-react'
import { cn } from '@/lib/utils'

const NAV = [
  { href: '/posts', label: 'Posts', icon: FileText },
  { href: '/categories', label: 'Categories', icon: Folder },
  { href: '/tags', label: 'Tags', icon: Tag },
]

export default function SideBar() {
  const pathname = usePathname()

  return (
    <aside className='bg-card flex shrink-0 flex-col border-b md:sticky md:top-0 md:h-screen md:w-56 md:border-r md:border-b-0'>
      <div className='flex items-center gap-2 px-5 py-4'>
        <span className='bg-primary text-primary-foreground grid size-7 place-items-center rounded-md'>
          <PenSquare className='size-4' />
        </span>
        <span className='font-semibold'>Blog Creator</span>
      </div>

      <nav className='flex gap-1 overflow-x-auto px-3 pb-3 md:flex-col md:pb-0'>
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(`${href}/`)
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors',
                active
                  ? 'bg-accent text-primary font-medium'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground',
              )}
            >
              <Icon className='size-4' />
              {label}
            </Link>
          )
        })}
      </nav>

      <div className='mt-auto hidden px-3 py-4 md:block'>
        <Link
          href='/blog'
          target='_blank'
          className='text-muted-foreground hover:bg-muted hover:text-foreground flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm'
        >
          <ExternalLink className='size-4' />
          View blog
        </Link>
      </div>
    </aside>
  )
}
