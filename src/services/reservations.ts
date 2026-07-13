import { api } from './api'
import { API_ENDPOINTS } from '@/constants'

export interface CreateReservationData {
  fullName: string
  email: string
  phone: string
  age: number
  reservationDate: string
  hasAdvisor: boolean
  advisorName: string | null
}

export interface CreateReservationResult {
  reservationId: string
  reservationNumber: string
  ticketNumber: string
  ticketId: string
  status: 'confirmed' | 'cancelled' | 'completed'
}

export interface LoginResult {
  token: string
  expiresIn: string
  admin: { id: string; username: string; role: string }
}

export interface DashboardStats {
  totalReservations: number
  availableSlots: number
  fullDates: number
  reservationsByMonth: Record<string, number>
  occupancyRate: number
}

export interface ReservationsFilters {
  month?: number
  year?: number
  status?: string
  search?: string
  page?: number
  limit?: number
}

export interface ReservationListItem {
  id: string
  reservationNumber: string
  reservationDate: string
  status: string
  createdAt: string
  participant: {
    id: string
    fullName: string
    email: string
    phone: string
    age: number
    advisor: string | null
  }
  ticket: { id: string; ticketNumber: string } | null
}

export interface ReservationsResponse {
  data: ReservationListItem[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export async function loginAdmin(
  username: string,
  password: string,
): Promise<LoginResult> {
  const { data } = await api.post('/api/v1/auth/login', { username, password })
  return data
}

export async function createReservation(
  payload: CreateReservationData,
): Promise<CreateReservationResult> {
  const { data } = await api.post(API_ENDPOINTS.RESERVATIONS, payload)
  return data
}

export async function fetchDashboard(
  token: string,
): Promise<DashboardStats> {
  const { data } = await api.get('/api/v1/admin/dashboard', {
    headers: { Authorization: `Bearer ${token}` },
  })
  return data
}

export async function fetchReservations(
  token: string,
  filters: ReservationsFilters = {},
): Promise<ReservationsResponse> {
  const { data } = await api.get('/api/v1/admin/reservations', {
    headers: { Authorization: `Bearer ${token}` },
    params: filters,
  })
  return data
}

export async function updateReservation(
  token: string,
  id: string,
  payload: Record<string, unknown>,
): Promise<void> {
  await api.put(`/api/v1/admin/reservations/${id}`, payload, {
    headers: { Authorization: `Bearer ${token}` },
  })
}

export async function deleteReservation(
  token: string,
  id: string,
): Promise<void> {
  await api.delete(`/api/v1/admin/reservations/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
}

export interface CampaignConfig {
  maxSlotsPerDay: number
  campaignYear: number
  allowedMonths: number[]
  minAge: number
}

export async function fetchCampaignConfig(): Promise<CampaignConfig> {
  const { data } = await api.get('/api/v1/config')
  return data
}

export interface AvailabilityDay {
  date: string
  status: 'available' | 'last-spot' | 'full' | 'weekend' | 'past' | 'disabled' | 'empty' | 'blocked'
  bookedCount: number
  remainingSlots: number
  maxSlots: number
  isSelectable: boolean
  isBlocked?: boolean
}

export async function fetchAvailability(
  month?: number,
  year?: number,
): Promise<{ maxSlotsPerDay: number; days: AvailabilityDay[] }> {
  const { data } = await api.get('/api/v1/availability', { params: { month, year } })
  return data
}

export async function blockDate(
  token: string,
  date: string,
): Promise<void> {
  await api.post(`/api/v1/admin/blocked-dates/${date}`, undefined, {
    headers: { Authorization: `Bearer ${token}` },
  })
}

export async function unblockDate(
  token: string,
  date: string,
): Promise<void> {
  await api.delete(`/api/v1/admin/blocked-dates/${date}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
}

export async function reassignReservationDate(
  token: string,
  id: string,
  reservationDate: string,
): Promise<void> {
  await api.patch(`/api/v1/admin/reservations/${id}/date`, { reservationDate }, {
    headers: { Authorization: `Bearer ${token}` },
  })
}

export async function syncGoogleSheets(token: string): Promise<void> {
  await api.post('/api/v1/admin/sheets/sync', undefined, {
    headers: { Authorization: `Bearer ${token}` },
  })
}
