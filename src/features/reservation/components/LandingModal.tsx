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
  const { startWizard } = useReservation()

  return (
    <>
      <ModalOverlay />
      <Modal>
        <ModalContent className="max-w-3xl">
          <ModalHeader>
            <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700 ring-1 ring-indigo-600/20">
              <Sparkles className="size-3.5" />
              Experiencia inmersiva
            </div>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
              🚀 Sé Programador por un Día
            </h1>
            <p className="text-base text-slate-500 sm:text-lg">
              Vive una experiencia real dentro de una empresa de desarrollo de software.
            </p>
          </ModalHeader>

          <ModalBody>
            <div className="grid gap-3 sm:grid-cols-2">
              {experienceCards.map(({ icon: Icon, title, description }) => (
                <Card key={title} hover glass className="overflow-hidden">
                  <CardContent className="flex items-start gap-4 p-4">
                    <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-white shadow-sm">
                      <Icon className="size-5" />
                    </div>
                    <div className="space-y-1 text-left">
                      <p className="font-medium text-slate-900">{title}</p>
                      <p className="text-sm text-slate-500">{description}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <Card glass>
                <CardContent className="flex items-center gap-3 p-4">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                    <Clock className="size-5" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                      Horario
                    </p>
                    <p className="font-medium text-slate-900">08:00 AM - 02:00 PM</p>
                  </div>
                </CardContent>
              </Card>
              <Card glass>
                <CardContent className="flex items-center gap-3 p-4">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                    <CalendarDays className="size-5" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                      Edad mínima
                    </p>
                    <p className="font-medium text-slate-900">15 años</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </ModalBody>

          <ModalFooter>
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
