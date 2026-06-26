import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from '@/utils'

interface SectionTitleProps extends HTMLAttributes<HTMLDivElement> {
  title: string
  description?: string
  action?: ReactNode
  align?: 'left' | 'center'
}

export function SectionTitle({
  title,
  description,
  action,
  align = 'left',
  className,
  ...props
}: SectionTitleProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between',
        align === 'center' && 'items-center text-center sm:flex-col sm:items-center',
        className,
      )}
      {...props}
    >
      <div className={cn('space-y-2', align === 'center' && 'max-w-2xl')}>
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
          {title}
        </h2>
        {description && (
          <p className="text-sm text-slate-500 sm:text-base">{description}</p>
        )}
      </div>
      {action}
    </div>
  )
}
