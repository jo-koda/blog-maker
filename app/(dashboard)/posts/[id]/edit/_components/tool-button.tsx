'use client'

import { ReactNode, useEffect, useRef, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

export function ToolButton({
  label,
  active = false,
  disabled = false,
  onClick,
  children,
}: {
  label: string
  active?: boolean
  disabled?: boolean
  onClick: () => void
  children: ReactNode
}) {
  return (
    <button
      type='button'
      title={label}
      aria-label={label}
      aria-pressed={active}
      disabled={disabled}
      onMouseDown={(event) => event.preventDefault()}
      onClick={onClick}
      className={cn(
        'grid size-8 shrink-0 cursor-pointer place-items-center rounded-md transition-colors disabled:cursor-default disabled:opacity-35 [&_svg]:size-4',
        active
          ? 'bg-accent text-primary'
          : 'text-muted-foreground hover:bg-muted hover:text-foreground',
      )}
    >
      {children}
    </button>
  )
}

export function Divider() {
  return <span className='bg-border mx-1 h-5 w-px shrink-0' />
}

export function ToolSelect({
  label,
  value,
  options,
  onChange,
  className,
}: {
  label: string
  value: string
  options: { label: string; value: string }[]
  onChange: (value: string) => void
  className?: string
}) {
  return (
    <select
      title={label}
      aria-label={label}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className={cn(
        'text-muted-foreground hover:bg-muted hover:text-foreground h-8 shrink-0 cursor-pointer rounded-md bg-transparent px-1.5 text-xs transition-colors outline-none',
        className,
      )}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  )
}

export function ToolPopover({
  label,
  icon,
  active = false,
  children,
}: {
  label: string
  icon: ReactNode
  active?: boolean
  children: (close: () => void) => ReactNode
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    function onPointer(event: PointerEvent) {
      if (!ref.current?.contains(event.target as Node)) setOpen(false)
    }
    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('pointerdown', onPointer)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onPointer)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <div ref={ref} className='relative shrink-0'>
      <button
        type='button'
        title={label}
        aria-label={label}
        aria-expanded={open}
        aria-haspopup='dialog'
        onMouseDown={(event) => event.preventDefault()}
        onClick={() => setOpen(!open)}
        className={cn(
          'flex h-8 cursor-pointer items-center gap-0.5 rounded-md px-1.5 transition-colors [&_svg]:size-4',
          active || open
            ? 'bg-accent text-primary'
            : 'text-muted-foreground hover:bg-muted hover:text-foreground',
        )}
      >
        {icon}
        <ChevronDown className='size-3! opacity-60' />
      </button>
      {open && (
        <div
          role='dialog'
          aria-label={label}
          className='bg-card absolute top-full left-0 z-30 mt-1 rounded-lg border p-2 shadow-lg'
        >
          {children(() => setOpen(false))}
        </div>
      )}
    </div>
  )
}
