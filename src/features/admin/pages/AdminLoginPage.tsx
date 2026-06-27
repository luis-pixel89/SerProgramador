import { type FormEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Lock, LogIn, User } from 'lucide-react'
import { Button, Card, CardContent, Input } from '@/components'
import { ROUTES } from '@/constants'
import { useAuth } from '../context'

export default function AdminLoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setError(false)
    setLoading(true)

    const success = await login(username, password)
    setLoading(false)

    if (success) {
      navigate(ROUTES.ADMIN)
    } else {
      setError(true)
    }
  }

  return (
    <div className="flex min-h-dvh items-center justify-center bg-slate-50/50 px-4">
      <Card className="w-full max-w-sm">
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6 p-6 sm:p-8">
            <div className="space-y-1.5 text-center">
              <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-sm">
                <Lock className="size-5" />
              </div>
              <h1 className="text-xl font-semibold tracking-tight text-slate-900">
                Acceso Administrador
              </h1>
              <p className="text-sm text-slate-500">
                Ingresa tus credenciales para acceder al panel.
              </p>
            </div>

            <div className="space-y-4">
              <Input
                label="Usuario"
                placeholder="admin"
                leftIcon={<User className="size-4" />}
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                autoFocus
              />
              <Input
                label="Contraseña"
                placeholder="••••••"
                type="password"
                leftIcon={<Lock className="size-4" />}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </div>

            {error && (
              <p className="text-center text-sm font-medium text-red-600">
                Usuario o contraseña incorrectos.
              </p>
            )}

            <Button type="submit" size="lg" fullWidth rightIcon={<LogIn className="size-4" />} disabled={loading}>
              {loading ? 'Ingresando...' : 'Ingresar'}
            </Button>

            <Button type="button" variant="outline" size="lg" fullWidth onClick={() => navigate(ROUTES.HOME)}>
              Cancelar
            </Button>
          </CardContent>
        </form>
      </Card>
    </div>
  )
}
