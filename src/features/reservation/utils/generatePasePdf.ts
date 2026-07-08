import QRCode from 'qrcode'
import jsPDF from 'jspdf'
import paseTemplateBg from '@/assets/formato-krakedev-template.png'
import { CAMPAIGN_ADDRESS, CAMPAIGN_SCHEDULE } from '../domain/campaignDisplay'

const QR_DATA = 'https://maps.app.goo.gl/y9kpVCUan5joQ8C49'
const PDF_FILENAME = 'pase-krakedev.pdf'

const ACTIVITIES = [
  { title: '¡Arrancamos la aventura!', description: 'Conoce nuestro espacio, al equipo y todo lo que tenemos preparado para vivir una experiencia diferente.' },
  { title: '¡Conoce a los cracks del código!', description: 'Descubre a nuestros programadores, sus proyectos y cómo es el mundo de la tecnología.' },
  { title: '¡Sé tester por un día!', description: 'Pon a prueba tus habilidades, encuentra errores y ayuda a mejorar aplicaciones.' },
  { title: '¡Atrévete con el Escape Room tecnológico!', description: 'Resuelve retos, descifra pistas y demuestra tu trabajo en equipo.' },
  { title: '¡Manos al código con módulo EPS!', description: 'Aprende programación y descubre cómo nacen las soluciones digitales.' },
  { title: '¡Almuerza con nuestros programadores!', description: 'Trae tu almuerzo y comparte historias, experiencias y momentos junto al equipo.' },
  { title: '¡Cerramos la aventura!', description: 'Despedimos el día con aprendizajes, diversión y nuevos recuerdos.' },
] as const

/** Márgenes del membrete (formato krakedev.docx, tamaño A4). */
const TEMPLATE_MARGINS = {
  top: 25,
  right: 30,
  bottom: 25,
  left: 30,
} as const

const LABEL_OFFSET = 40
const TEXT_COLOR = { r: 0, g: 0, b: 0 } as const

function setTextBlack(pdf: jsPDF) {
  pdf.setTextColor(TEXT_COLOR.r, TEXT_COLOR.g, TEXT_COLOR.b)
}

function drawField(
  pdf: jsPDF,
  label: string,
  value: string,
  y: number,
  valueX: number,
  labelX: number,
  valueMaxWidth: number,
): number {
  pdf.setFontSize(9)
  pdf.setFont('helvetica', 'normal')
  setTextBlack(pdf)
  pdf.text(label, labelX, y)
  const lines = pdf.splitTextToSize(value, valueMaxWidth)
  pdf.text(lines, valueX, y)
  return y + lines.length * 5 + 2
}

function drawActivitiesPage(pdf: jsPDF, pageW: number, pageH: number, contentLeft: number) {
  pdf.addPage()
  pdf.addImage(paseTemplateBg, 'PNG', 0, 0, pageW, pageH)

  const contentRight = pageW - TEMPLATE_MARGINS.right
  const contentWidth = contentRight - contentLeft

  let y = TEMPLATE_MARGINS.top + 10

  setTextBlack(pdf)
  pdf.setFontSize(16)
  pdf.setFont('helvetica', 'bold')
  pdf.text('Actividades del Día', pageW / 2, y, { align: 'center' })

  y += 10
  pdf.setDrawColor(239, 10, 16)
  pdf.setLineWidth(0.3)
  pdf.line(contentLeft, y, contentRight, y)

  y += 10

  for (let i = 0; i < ACTIVITIES.length; i++) {
    const { title, description } = ACTIVITIES[i]
    const number = `${i + 1}.`

    pdf.setFontSize(11)
    pdf.setFont('helvetica', 'bold')
    setTextBlack(pdf)
    pdf.text(`${number} ${title}`, contentLeft, y)

    y += 6

    pdf.setFontSize(9)
    pdf.setFont('helvetica', 'normal')
    setTextBlack(pdf)

    const descLines = pdf.splitTextToSize(description, contentWidth)
    pdf.text(descLines, contentLeft + 4, y)

    y += descLines.length * 5 + 6
  }

  if (y < pageH - TEMPLATE_MARGINS.bottom - 8) {
    y = pageH - TEMPLATE_MARGINS.bottom - 8
  }

  pdf.setDrawColor(239, 10, 16)
  pdf.setLineWidth(0.3)
  pdf.line(contentLeft, y, contentRight, y)
  y += 5
  pdf.setFontSize(8)
  setTextBlack(pdf)
  pdf.text('Krakedev — Escuela de Programación', pageW / 2, y, { align: 'center' })
}

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

  const pdf = new jsPDF({ unit: 'mm', format: 'a4' })
  const pageW = pdf.internal.pageSize.getWidth()
  const pageH = pdf.internal.pageSize.getHeight()
  const contentLeft = TEMPLATE_MARGINS.left
  const valueX = contentLeft + LABEL_OFFSET
  const valueMaxWidth = pageW - TEMPLATE_MARGINS.right - valueX

  pdf.addImage(paseTemplateBg, 'PNG', 0, 0, pageW, pageH)

  let y = TEMPLATE_MARGINS.top + 48

  setTextBlack(pdf)
  pdf.setFontSize(16)
  pdf.setFont('helvetica', 'bold')
  pdf.text('Pase de entrada — Sé Programador por un Día', pageW / 2, y, { align: 'center' })

  y += 14
  pdf.setFontSize(12)
  pdf.setFont('helvetica', 'bold')
  pdf.text('Datos del Participante', contentLeft, y)

  y += 9

  const fields = [
    ['Nombre', data.fullName],
    ['Email', data.email],
    ['Telefono', data.phone],
    ['Edad', String(data.age)],
    ['Fecha', data.date],
    ['Horario', CAMPAIGN_SCHEDULE],
    ['Dirección', CAMPAIGN_ADDRESS],
  ] as const

  for (const [label, value] of fields) {
    y = drawField(pdf, label, value, y, valueX, contentLeft, valueMaxWidth)
  }

  y += 8
  const qrSize = 50
  const qrX = pageW / 2 - qrSize / 2

  pdf.setFillColor(255, 255, 255)
  pdf.roundedRect(qrX - 2, y - 2, qrSize + 4, qrSize + 4, 2, 2, 'F')
  pdf.addImage(qrDataUrl, 'PNG', qrX, y, qrSize, qrSize)

  y += qrSize + 5
  pdf.setFontSize(8)
  pdf.setFont('helvetica', 'normal')
  setTextBlack(pdf)
  pdf.text('Escanea para ver la ubicacion', pageW / 2, y, { align: 'center' })

  y += 12
  const footerY = pageH - TEMPLATE_MARGINS.bottom - 8
  if (y < footerY) {
    y = footerY
  }

  pdf.setDrawColor(239, 10, 16)
  pdf.setLineWidth(0.3)
  pdf.line(contentLeft, y, pageW - TEMPLATE_MARGINS.right, y)
  y += 5
  pdf.setFontSize(8)
  setTextBlack(pdf)
  pdf.text('Krakedev — Escuela de Programación', pageW / 2, y, { align: 'center' })

  drawActivitiesPage(pdf, pageW, pageH, contentLeft)

  pdf.save(PDF_FILENAME)
}
