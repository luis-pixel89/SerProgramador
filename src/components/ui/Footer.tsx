import { cn } from '@/utils'

interface FooterProps {
  className?: string
}

export function Footer({ className }: FooterProps) {
  return (
    <footer className={cn('border-t border-[#2d2d2d] bg-[#111111]', className)}>
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row sm:px-6 lg:px-8">
        <p className="text-sm text-[#9ca3af]">
          © {new Date().getFullYear()} Krakedev. Todos los derechos reservados.
        </p>
        <div className="flex items-center gap-6 text-sm text-[#9ca3af]">
          <span className="transition-colors hover:text-white">Privacidad</span>
          <span className="transition-colors hover:text-white">Términos</span>
          <span className="transition-colors hover:text-white">Contacto</span>
        </div>
      </div>
    </footer>
  )
}
