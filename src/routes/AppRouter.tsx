import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { ROUTES } from '@/constants'
import { AdminLayout, MainLayout } from '@/layouts'
import { ErrorBoundary } from '@/components'
import { routeConfig } from './routes.config'

const KrakeSplashPage = lazy(() => import('@/features/krakedev/pages/KrakeSplashPage'))
const KrakeHomePage = lazy(() => import('@/features/krakedev/pages/KrakeHomePage'))
const AdminLoginPage = lazy(() => import('@/features/admin/pages/AdminLoginPage'))

function RouteFallback() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-indigo-500" />
    </div>
  )
}

export function AppRouter() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<RouteFallback />}>
        <Routes>
        <Route element={<MainLayout />}>
          {routeConfig
            .filter((route) => route.layout === 'main')
            .map(({ path, element: Page }) => (
              <Route key={path} path={path} element={<Page />} />
            ))}
        </Route>

        <Route element={<AdminLayout />}>
          {routeConfig
            .filter((route) => route.layout === 'admin')
            .map(({ path, element: Page }) => (
              <Route key={path} path={path} element={<Page />} />
            ))}
        </Route>

        <Route path={ROUTES.KRAKE.SPLASH} element={<KrakeSplashPage />} />
        <Route path={ROUTES.KRAKE.HOME} element={<KrakeHomePage />} />

        <Route path={ROUTES.ADMIN_LOGIN} element={<AdminLoginPage />} />

        <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  )
}
