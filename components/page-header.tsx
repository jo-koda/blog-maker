import { ReactNode } from 'react'

export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string
  description?: string
  actions?: ReactNode
}) {
  return (
    <div className='flex flex-wrap items-start justify-between gap-3'>
      <div>
        <h1 className='text-xl font-semibold'>{title}</h1>
        {description && (
          <p className='text-muted-foreground mt-0.5 text-sm'>{description}</p>
        )}
      </div>
      {actions}
    </div>
  )
}
