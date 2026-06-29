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
    styles: 'border-[#ef0a10]/30 bg-[#ef0a10]/10 text-[#ef0a10]',
  },
  success: {
    icon: CheckCircle2,
    styles: 'border-emerald-700 bg-emerald-950/40 text-emerald-400',
  },
  warning: {
    icon: TriangleAlert,
    styles: 'border-amber-700 bg-amber-950/40 text-amber-400',
  },
  error: {
    icon: AlertCircle,
    styles: 'border-red-800 bg-red-950/40 text-red-400',
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
