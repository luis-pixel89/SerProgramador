import { cn } from '@/utils'

interface FooterProps {
  className?: string
}

export function Footer({ className }: FooterProps) {
  return (
    <footer className={cn('border-t border-slate-200/80 bg-white', className)}>
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row sm:px-6 lg:px-8">
        <p className="text-sm text-slate-500">
          © {new Date().getFullYear()} Krakedev. Todos los derechos reservados.
        </p>
        <div className="flex items-center gap-6 text-sm text-slate-500">
          <span className="transition-colors hover:text-slate-900">Privacidad</span>
          <span className="transition-colors hover:text-slate-900">Términos</span>
          <span className="transition-colors hover:text-slate-900">Contacto</span>
        </div>
      </div>
    </footer>
  )
}
