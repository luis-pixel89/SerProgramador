import type { InputHTMLAttributes, ReactNode } from 'react'
import { cn } from '@/utils'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  hint?: string
  error?: string
  leftIcon?: ReactNode
}

export function Input({
  label,
  hint,
  error,
  leftIcon,
  className,
  id,
  ...props
}: InputProps) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className="w-full space-y-2">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-slate-700">
          {label}
        </label>
      )}
      <div className="relative">
        {leftIcon && (
          <div className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center text-slate-400">
            {leftIcon}
          </div>
        )}
        <input
          id={inputId}
          className={cn(
            'h-11 w-full rounded-xl border bg-white px-3.5 text-sm text-slate-900 shadow-sm',
            'placeholder:text-slate-400 transition-colors duration-200',
            'focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20',
            leftIcon ? 'pl-10' : undefined,
            error
              ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20'
              : 'border-slate-200',
            className,
          )}
          {...props}
        />
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
      {!error && hint && <p className="text-sm text-slate-500">{hint}</p>}
    </div>
  )
}
