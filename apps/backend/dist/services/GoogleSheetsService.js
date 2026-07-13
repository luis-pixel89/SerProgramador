import { google } from 'googleapis'
import { env } from '../config/env.js'
import { logger } from './LoggerService.js'
import { ReservationRepository } from '../repositories/reservation.repository.js'

const SHEET_HEADERS = [
  'ID',
  'No. Reserva',
  'Nombre',
  'Correo',
  'Edad',
  'Teléfono',
  'Asesor',
  'Fecha',
  'Estado',
  'Fecha de Registro',
]

export class GoogleSheetsService {
  #sheets
  #repository

  constructor() {
    this.#repository = new ReservationRepository()
  }

  async #getAuthClient() {
    const privateKey = env.GOOGLE_PRIVATE_KEY_BASE64
      ? Buffer.from(env.GOOGLE_PRIVATE_KEY_BASE64, 'base64').toString('utf-8')
      : env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n')

    const auth = new google.auth.GoogleAuth({
      credentials: {
        type: 'service_account',
        project_id: env.GOOGLE_PROJECT_ID,
        private_key: privateKey,
        client_email: env.GOOGLE_CLIENT_EMAIL,
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    })
    return auth
  }

  async #getSheetsApi() {
    if (!this.#sheets) {
      const auth = await this.#getAuthClient()
      this.#sheets = google.sheets({ version: 'v4', auth })
    }
    return this.#sheets
  }

  async #getAllReservations() {
    const { data } = await this.#repository.findMany({
      limit: 99999,
      page: 1,
      status: 'CONFIRMED',
    })
    return data
  }

  #pad(n) {
    return String(n).padStart(2, '0')
  }

  #formatDate(value) {
    if (!value) return ''
    const d = value instanceof Date ? value : new Date(value + 'T12:00:00')
    return `${this.#pad(d.getDate())}/${this.#pad(d.getMonth() + 1)}/${d.getFullYear()}`
  }

  #formatCreatedAt(value) {
    if (!value) return ''
    const d = value instanceof Date ? value : new Date(value)
    return `${this.#pad(d.getDate())}/${this.#pad(d.getMonth() + 1)}/${d.getFullYear()} ${this.#pad(d.getHours())}:${this.#pad(d.getMinutes())}`
  }

  #getStatusLabel(status) {
    const map = {
      CONFIRMED: 'Confirmada',
      CANCELLED: 'Cancelada',
      COMPLETED: 'Completada',
      confirmed: 'Confirmada',
      cancelled: 'Cancelada',
      completed: 'Completada',
    }
    return map[status] ?? status
  }

  #toRow(reservation) {
    return [
      reservation.id,
      reservation.reservationNumber ?? '',
      reservation.participant?.fullName ?? '',
      reservation.participant?.email ?? '',
      reservation.participant?.age ?? '',
      reservation.participant?.phone ?? '',
      reservation.participant?.advisor ?? '',
      this.#formatDate(reservation.reservationDate),
      this.#getStatusLabel(reservation.status),
      this.#formatCreatedAt(reservation.createdAt),
    ]
  }

  async syncAll() {
    if (!env.GOOGLE_SHEETS_ENABLED) return

    try {
      const sheets = await this.#getSheetsApi()
      const sheetId = env.GOOGLE_SHEET_ID

      const reservations = await this.#getAllReservations()
      const rows = reservations.map((r) => this.#toRow(r))

      const data = [SHEET_HEADERS, ...rows]

      await sheets.spreadsheets.values.update({
        spreadsheetId: sheetId,
        range: 'A:Z',
        valueInputOption: 'RAW',
        requestBody: { values: data },
      })

      // Also clear any extra rows if data shrunk
      if (data.length < 2) return

      const lastRowWithData = data.length
      await sheets.spreadsheets.values.clear({
        spreadsheetId: sheetId,
        range: `A${lastRowWithData + 1}:Z`,
      }).catch(() => {
        // Ignore if no extra rows to clear
      })

      logger.info(`Google Sheets sync completed: ${reservations.length} rows synced`, 'sheets')
    } catch (err) {
      logger.error('Google Sheets sync failed', 'sheets', { error: err.message }, err)
    }
  }
}

export const googleSheetsService = new GoogleSheetsService()
