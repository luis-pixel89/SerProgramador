import { lazy } from 'react'
import { ROUTES } from '@/constants'

const HomePage = lazy(() => import('@/pages/HomePage'))
const AdminPage = lazy(() => import('@/pages/AdminPage'))

export const routeConfig = [
  {
    path: ROUTES.HOME,
    element: HomePage,
    layout: 'main' as const,
  },
  {
    path: ROUTES.ADMIN,
    element: AdminPage,
    layout: 'admin' as const,
  },
] as const

export type RouteLayout = (typeof routeConfig)[number]['layout']
