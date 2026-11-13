'use client'

import { ReactNode, useEffect } from 'react'
import { X } from 'lucide-react'

export function Modal({
  open,
  title,
  onClose,
  children,
  footer,
}: {
  open: boolean
  title: string
  onClose: () => void
  children: ReactNode
  footer?: ReactNode
}) {
  useEffect(() => {
    if (!open) return
    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      className='fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4'
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div
        role='dialog'
        aria-modal='true'
        aria-label={title}
        className='bg-card w-full max-w-md rounded-xl shadow-xl'
      >
        <div className='flex items-center justify-between border-b px-5 py-3.5'>
          <h2 className='font-semibold'>{title}</h2>
          <button
            type='button'
            onClick={onClose}
            aria-label='Close'
            className='text-muted-foreground hover:text-foreground cursor-pointer'
          >
            <X className='size-4' />
          </button>
        </div>
        <div className='px-5 py-4 text-sm'>{children}</div>
        {footer && (
          <div className='flex justify-end gap-2 border-t px-5 py-3'>
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}
