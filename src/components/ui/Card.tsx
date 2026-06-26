import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from '@/utils'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  hover?: boolean
  glass?: boolean
}

export function Card({ children, hover = false, glass = false, className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-slate-200/80 bg-white shadow-sm',
        hover && 'transition-all duration-200 hover:border-slate-300 hover:shadow-md',
        glass && 'bg-white/80 backdrop-blur-xl',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardHeader({ children, className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('space-y-1.5 p-6 pb-0', className)} {...props}>
      {children}
    </div>
  )
}

export function CardTitle({ children, className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={cn('text-lg font-semibold tracking-tight text-slate-900', className)} {...props}>
      {children}
    </h3>
  )
}

export function CardDescription({
  children,
  className,
  ...props
}: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn('text-sm text-slate-500', className)} {...props}>
      {children}
    </p>
  )
}

export function CardContent({ children, className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('p-6', className)} {...props}>
      {children}
    </div>
  )
}

export function CardFooter({ children, className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('flex items-center gap-3 border-t border-slate-100 p-6 pt-4', className)}
      {...props}
    >
      {children}
    </div>
  )
}
