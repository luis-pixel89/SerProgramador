import { useLocation, useNavigate } from 'react-router-dom'
import { FaWhatsapp } from 'react-icons/fa'
import {
  CalendarDays,
  ChevronRight,
  Clock,
  Sparkles,
  Trophy,
  Users,
  UtensilsCrossed,
} from 'lucide-react'
import {
  Alert,
  Button,
  Card,
  CardContent,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@/components'
import { useReservation } from '../hooks'

const experienceCards = [
  { icon: Users, title: 'Conoce al equipo', description: 'Convive con desarrolladores reales.' },
  { icon: Trophy, title: 'Participa en retos', description: 'Resuelve problemas de software.' },
  {
    icon: Sparkles,
    title: 'Explora proyectos reales',
    description: 'Observa cómo se construye un producto.',
  },
  {
    icon: UtensilsCrossed,
    title: 'Almuerza con nosotros',
    description: 'Un espacio para conversar y aprender.',
  },
]

export function LandingModal() {
  const location = useLocation()
  const navigate = useNavigate()
  const error = (location.state as { error?: string } | null)?.error
  const duplicateError = (location.state as { duplicateError?: boolean } | null)?.duplicateError
  const { startWizard } = useReservation()

  if (duplicateError) {
    return (
      <>
        <ModalOverlay />
        <Modal>
          <ModalContent className="max-w-md">
            <div className="flex flex-col items-center gap-6 p-8 text-center">
              <h2 className="text-xl font-semibold text-white">
                Solo se puede hacer una reservación por persona
              </h2>
              <Button size="lg" fullWidth onClick={() => navigate('.', { replace: true })}>
                ACEPTAR
              </Button>
            </div>
          </ModalContent>
        </Modal>
      </>
    )
  }

  return (
    <>
      <ModalOverlay />
      <Modal>
        <ModalContent className="max-w-3xl">
          {error && (
            <div className="px-6 pt-6">
              <Alert variant="error" title={error} />
            </div>
          )}
          <ModalHeader>
            <div className="inline-flex items-center gap-2 rounded-full bg-[#ef0a10]/10 px-3 py-1 text-xs font-medium text-[#ef0a10] ring-1 ring-[#ef0a10]/30">
              <Sparkles className="size-3.5" />
              Experiencia inmersiva
            </div>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              🚀 Sé Programador por un Día
            </h1>
            <p className="text-base text-[#9ca3af] sm:text-lg">
              Vive una experiencia real dentro de una empresa de desarrollo de software.
            </p>
          </ModalHeader>

          <ModalBody>
            <div className="grid gap-3 sm:grid-cols-2">
              {experienceCards.map(({ icon: Icon, title, description }) => (
                <Card key={title} hover glass className="overflow-hidden">
                  <CardContent className="flex items-start gap-4 p-4">
                    <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#ef0a10] text-white shadow-sm">
                      <Icon className="size-5" />
                    </div>
                    <div className="space-y-1 text-left">
                      <p className="font-medium text-white">{title}</p>
                      <p className="text-sm text-[#9ca3af]">{description}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <Card glass>
                <CardContent className="flex items-center gap-3 p-4">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-950/40 text-emerald-400">
                    <Clock className="size-5" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-medium uppercase tracking-wide text-[#9ca3af]">
                      Horario
                    </p>
                    <p className="font-medium text-white">08:00 AM - 02:00 PM</p>
                  </div>
                </CardContent>
              </Card>
              <Card glass>
                <CardContent className="flex items-center gap-3 p-4">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-[#ef0a10]/10 text-[#ef0a10]">
                    <CalendarDays className="size-5" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-medium uppercase tracking-wide text-[#9ca3af]">
                      Edad mínima
                    </p>
                    <p className="font-medium text-white">15 años</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </ModalBody>

          <ModalFooter className="flex-col gap-3 sm:flex-row sm:justify-between">
            <a
              href="https://wa.me/593982393311?text=Hola%2C%20quiero%20cancelar%20mi%20reserva%20para%20S%C3%A9%20Programador%20por%20un%20D%C3%ADa"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-[#2d2d2d] bg-transparent px-6 py-3 text-base font-medium text-[#9ca3af] shadow-sm transition-colors hover:bg-[#111111] hover:text-white sm:w-auto"
            >
              <FaWhatsapp className="size-4" />
              Cancelar/Reagendar
            </a>
            <Button
              size="lg"
              fullWidth
              rightIcon={<ChevronRight className="size-4" />}
              onClick={startWizard}
              className="w-full sm:w-auto"
            >
              Ver Fechas Disponibles
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
