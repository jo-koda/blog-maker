import { ComponentProps } from 'react'
import { cn } from '@/lib/utils'

export const fieldClass =
  'w-full rounded-lg border border-input bg-card px-3 py-2 text-sm text-foreground transition-colors placeholder:text-muted-foreground/70 focus:border-primary focus:ring-[3px] focus:ring-ring focus:outline-none aria-invalid:border-destructive'

export function Input({ className, ...props }: ComponentProps<'input'>) {
  return <input className={cn(fieldClass, className)} {...props} />
}

export function Textarea({ className, ...props }: ComponentProps<'textarea'>) {
  return (
    <textarea className={cn(fieldClass, 'resize-y', className)} {...props} />
  )
}

export function Select({ className, ...props }: ComponentProps<'select'>) {
  return (
    <select
      className={cn(fieldClass, 'cursor-pointer pr-8', className)}
      {...props}
    />
  )
}
