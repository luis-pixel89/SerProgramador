export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3001',
  TIMEOUT: 10_000,
} as const

export const API_ENDPOINTS = {
  RESERVATIONS: '/reservations',
} as const
