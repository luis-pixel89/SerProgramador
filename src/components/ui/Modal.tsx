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
        'fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300',
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
        'relative w-full max-w-2xl overflow-hidden rounded-2xl border border-[#2d2d2d]',
        'bg-[#111111] shadow-2xl shadow-black/30 backdrop-blur-xl',
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
        'flex flex-col-reverse gap-3 border-t border-[#2d2d2d] bg-[#1e1e1e]/50 p-6 sm:flex-row sm:justify-end sm:p-8',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}
