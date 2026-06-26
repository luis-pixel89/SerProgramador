export const ROUTES = {
  HOME: '/',
  ADMIN: '/admin',
} as const

export type AppRoute = (typeof ROUTES)[keyof typeof ROUTES]
