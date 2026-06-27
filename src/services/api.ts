import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios'
import { API_CONFIG } from '@/constants'

export class ApiError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

export const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => config,
  (error: AxiosError) => Promise.reject(error),
)

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const status = error.response?.status ?? 500
    const message =
      (error.response?.data as { message?: string } | undefined)?.message ??
      error.message ??
      'Error inesperado en la solicitud'

    return Promise.reject(new ApiError(message, status))
  },
)
