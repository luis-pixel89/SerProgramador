import { cn } from '@/utils'

interface LoaderProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
  label?: string
}

const sizeStyles = {
  sm: 'size-5 border-2',
  md: 'size-8 border-2',
  lg: 'size-12 border-[3px]',
}

export function Loader({ size = 'md', className, label = 'Cargando...' }: LoaderProps) {
  return (
    <div className={cn('flex flex-col items-center gap-3', className)} role="status">
      <div
        className={cn(
          'animate-spin rounded-full border-slate-200 border-t-indigo-500',
          sizeStyles[size],
        )}
      />
      <span className="sr-only">{label}</span>
    </div>
  )
}

export function PageLoader() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center">
      <Loader size="lg" />
    </div>
  )
}
