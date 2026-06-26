import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from '@/utils'

interface ModalProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  open?: boolean
}

export function ModalOverlay({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300',
        className,
      )}
      {...props}
    />
  )
}

export function Modal({ children, open = true, className, ...props }: ModalProps) {
  if (!open) return null

  return (
    <div
      className={cn(
        'fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6',
        className,
      )}
      role="dialog"
      aria-modal="true"
      {...props}
    >
      {children}
    </div>
  )
}

export function ModalContent({ children, className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'relative w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-200/80',
        'bg-white/95 shadow-2xl shadow-slate-900/10 backdrop-blur-xl',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export function ModalHeader({ children, className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('space-y-2 p-6 pb-0 sm:p-8 sm:pb-0', className)} {...props}>
      {children}
    </div>
  )
}

export function ModalBody({ children, className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('space-y-6 p-6 sm:p-8', className)} {...props}>
      {children}
    </div>
  )
}

export function ModalFooter({ children, className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'flex flex-col-reverse gap-3 border-t border-slate-100 bg-slate-50/50 p-6 sm:flex-row sm:justify-end sm:p-8',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}
