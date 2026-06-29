import type { HTMLAttributes } from 'react'
import { cn } from '@/utils'

type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info'

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant
}

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-[#1e1e1e] text-[#9ca3af]',
  success: 'bg-emerald-950/40 text-emerald-400 ring-1 ring-emerald-500/30',
  warning: 'bg-amber-950/40 text-amber-400 ring-1 ring-amber-500/30',
  danger: 'bg-red-950/40 text-red-400 ring-1 ring-red-500/30',
  info: 'bg-[#ef0a10]/10 text-[#ef0a10] ring-1 ring-[#ef0a10]/30',
}

export function Badge({ variant = 'default', className, children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        variantStyles[variant],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  )
}
