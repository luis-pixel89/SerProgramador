import type { ReactNode } from 'react'
import { Inbox } from 'lucide-react'
import { cn } from '@/utils'

interface EmptyStateProps {
  icon?: ReactNode
  title: string
  description?: string
  action?: ReactNode
  className?: string
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200',
        'bg-slate-50/50 px-6 py-16 text-center',
        className,
      )}
    >
      <div className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-slate-200/80">
        {icon ?? <Inbox className="size-6 text-slate-400" />}
      </div>
      <h3 className="text-base font-semibold text-slate-900">{title}</h3>
      {description && (
        <p className="mt-2 max-w-sm text-sm text-slate-500">{description}</p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  )
}
