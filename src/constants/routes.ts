export const ROUTES = {
  HOME: '/',
  ADMIN: '/admin',
  ADMIN_LOGIN: '/admin/login',
  KRAKE: {
    SPLASH: '/krakedev',
    HOME: '/krakedev/home',
  },
} as const

export type AppRoute = (typeof ROUTES)[keyof typeof ROUTES]
