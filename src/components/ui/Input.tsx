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
        <label htmlFor={inputId} className="block text-sm font-medium text-white">
          {label}
        </label>
      )}
      <div className="relative">
        {leftIcon && (
          <div className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center text-[#6b7280]">
            {leftIcon}
          </div>
        )}
        <input
          id={inputId}
          className={cn(
            'h-11 w-full rounded-xl border bg-[#111111] px-3.5 text-sm text-white shadow-sm',
            'placeholder:text-[#6b7280] transition-colors duration-200',
            'focus:border-[#ef0a10] focus:outline-none focus:ring-2 focus:ring-[#ef0a10]/20',
            leftIcon ? 'pl-10' : undefined,
            error
              ? 'border-red-600 focus:border-red-400 focus:ring-red-400/20'
              : 'border-[#2d2d2d]',
            className,
          )}
          {...props}
        />
      </div>
      {error && <p className="text-sm text-red-400">{error}</p>}
      {!error && hint && <p className="text-sm text-[#6b7280]">{hint}</p>}
    </div>
  )
}
