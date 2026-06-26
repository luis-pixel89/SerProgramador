export interface TicketData {
  fullName: string
  date: string
  schedule: string
  address: string
  companyName: string
  mapsUrl: string
}

export interface TicketQrPayload {
  companyName: string
  address: string
  schedule: string
  mapsUrl: string
}
