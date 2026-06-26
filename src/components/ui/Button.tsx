import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '@/utils'

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  fullWidth?: boolean
  leftIcon?: ReactNode
  rightIcon?: ReactNode
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-slate-900 text-white shadow-sm hover:bg-slate-800 focus-visible:ring-slate-900/30',
  secondary:
    'bg-white text-slate-900 border border-slate-200 shadow-sm hover:bg-slate-50 focus-visible:ring-slate-900/20',
  outline:
    'border border-slate-200 bg-transparent text-slate-700 hover:bg-slate-50 focus-visible:ring-slate-900/20',
  ghost: 'bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900',
  danger:
    'bg-red-500 text-white shadow-sm hover:bg-red-600 focus-visible:ring-red-500/30',
}

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'h-9 px-3.5 text-sm gap-1.5 rounded-xl',
  md: 'h-11 px-5 text-sm gap-2 rounded-xl',
  lg: 'h-12 px-6 text-base gap-2 rounded-2xl',
}

export function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  leftIcon,
  rightIcon,
  className,
  children,
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        'inline-flex items-center justify-center font-medium transition-all duration-200',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
        'disabled:pointer-events-none disabled:opacity-50',
        variantStyles[variant],
        sizeStyles[size],
        fullWidth && 'w-full',
        className,
      )}
      {...props}
    >
      {leftIcon}
      {children}
      {rightIcon}
    </button>
  )
}
