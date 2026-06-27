import { Component, type ErrorInfo, type ReactNode } from 'react'
import { AlertCircle, RefreshCw } from 'lucide-react'
import { Button } from './Button'

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 px-4">
          <div className="flex size-14 items-center justify-center rounded-full bg-red-100">
            <AlertCircle className="size-7 text-red-600" />
          </div>
          <div className="space-y-1 text-center">
            <h2 className="text-lg font-semibold text-slate-900">
              Algo salió mal
            </h2>
            <p className="max-w-sm text-sm text-slate-500">
              Ocurrió un error inesperado. Intenta recargar la página.
            </p>
          </div>
          <Button variant="outline" leftIcon={<RefreshCw className="size-4" />} onClick={this.handleReset}>
            Reintentar
          </Button>
        </div>
      )
    }

    return this.props.children
  }
}
