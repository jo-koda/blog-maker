'use client'

import { ReactNode, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function Panel({
  title,
  defaultOpen = true,
  children,
}: {
  title: string
  defaultOpen?: boolean
  children: ReactNode
}) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <section className='bg-card rounded-xl border'>
      <button
        type='button'
        aria-expanded={open}
        onClick={() => setOpen(!open)}
        className='flex w-full cursor-pointer items-center justify-between px-4 py-3 text-sm font-semibold'
      >
        {title}
        <ChevronDown
          className={cn(
            'text-muted-foreground size-4 transition-transform',
            open && 'rotate-180',
          )}
        />
      </button>
      {open && (
        <div className='flex flex-col gap-4 border-t px-4 py-4'>{children}</div>
      )}
    </section>
  )
}
