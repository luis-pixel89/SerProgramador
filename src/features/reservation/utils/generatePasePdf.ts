import QRCode from 'qrcode'
import jsPDF from 'jspdf'
import { CAMPAIGN_ADDRESS, CAMPAIGN_SCHEDULE } from '../domain/campaignDisplay'

const QR_DATA = 'https://maps.app.goo.gl/y9kpVCUan5joQ8C49'
const PDF_FILENAME = 'pase-krakedev.pdf'

export async function generatePasePdf(data: {
  fullName: string
  email: string
  phone: string
  age: string | number
  date: string
}) {
  const qrDataUrl = await QRCode.toDataURL(QR_DATA, {
    width: 200,
    margin: 2,
    color: { dark: '#0f172a', light: '#ffffff' },
  })

  const pdf = new jsPDF({ unit: 'mm', format: 'a5' })
  const pageW = pdf.internal.pageSize.getWidth()
  const margin = 15
  let y = margin

  pdf.setFillColor(15, 23, 42)
  pdf.rect(0, 0, pageW, 28, 'F')
  pdf.setTextColor(255, 255, 255)
  pdf.setFontSize(18)
  pdf.setFont('helvetica', 'bold')
  pdf.text('Krakedev', pageW / 2, 16, { align: 'center' })
  pdf.setFontSize(9)
  pdf.setFont('helvetica', 'normal')
  pdf.text('Pase de entrada — Se Programador por un Dia', pageW / 2, 22, { align: 'center' })

  y = 38
  pdf.setTextColor(15, 23, 42)
  pdf.setFontSize(11)
  pdf.setFont('helvetica', 'bold')
  pdf.text('Datos del Participante', margin, y)
  y += 8
  pdf.setFont('helvetica', 'normal')
  pdf.setFontSize(9)

  const fields = [
    ['Nombre', data.fullName],
    ['Email', data.email],
    ['Telefono', data.phone],
    ['Edad', String(data.age)],
    ['Fecha', data.date],
    ['Horario', CAMPAIGN_SCHEDULE],
    ['Direccion', CAMPAIGN_ADDRESS],
  ] as const

  for (const [label, value] of fields) {
    pdf.setTextColor(100, 116, 139)
    pdf.text(label, margin, y)
    pdf.setTextColor(15, 23, 42)
    pdf.text(value, margin + 40, y)
    y += 6
  }

  y += 6
  const qrSize = 50
  const qrX = pageW / 2 - qrSize / 2
  pdf.addImage(qrDataUrl, 'PNG', qrX, y, qrSize, qrSize)
  y += qrSize + 4
  pdf.setFontSize(7)
  pdf.setTextColor(148, 163, 184)
  pdf.text('Escanea para ver la ubicacion', pageW / 2, y, { align: 'center' })

  y += 10
  if (y > pdf.internal.pageSize.getHeight() - margin) {
    pdf.addPage()
    y = margin
  }

  pdf.setDrawColor(226, 232, 240)
  pdf.setLineWidth(0.5)
  pdf.line(margin, y, pageW - margin, y)
  y += 4
  pdf.setFontSize(7)
  pdf.setTextColor(148, 163, 184)
  pdf.text('Krakedev — Escuela de Programacion', pageW / 2, y, { align: 'center' })

  pdf.save(PDF_FILENAME)
}
