import type { HTMLAttributes, ReactNode } from 'react'
import { AlertCircle, CheckCircle2, Info, TriangleAlert } from 'lucide-react'
import { cn } from '@/utils'

type AlertVariant = 'info' | 'success' | 'warning' | 'error'

interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  variant?: AlertVariant
  title?: string
  children?: ReactNode
}

const variantConfig: Record<
  AlertVariant,
  { icon: typeof Info; styles: string }
> = {
  info: {
    icon: Info,
    styles: 'border-indigo-200 bg-indigo-50/80 text-indigo-900',
  },
  success: {
    icon: CheckCircle2,
    styles: 'border-emerald-200 bg-emerald-50/80 text-emerald-900',
  },
  warning: {
    icon: TriangleAlert,
    styles: 'border-amber-200 bg-amber-50/80 text-amber-900',
  },
  error: {
    icon: AlertCircle,
    styles: 'border-red-200 bg-red-50/80 text-red-900',
  },
}

export function Alert({
  variant = 'info',
  title,
  children,
  className,
  ...props
}: AlertProps) {
  const { icon: Icon, styles } = variantConfig[variant]

  return (
    <div
      role="alert"
      className={cn(
        'flex gap-3 rounded-2xl border p-4',
        styles,
        className,
      )}
      {...props}
    >
      <Icon className="mt-0.5 size-5 shrink-0" />
      <div className="space-y-1">
        {title && <p className="text-sm font-semibold">{title}</p>}
        {children && <div className="text-sm opacity-90">{children}</div>}
      </div>
    </div>
  )
}
