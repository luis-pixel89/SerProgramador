export function formatDisplayDate(date: Date): string {
  return date.toLocaleDateString('es-EC', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export function formatShortDate(date: Date): string {
  return date.toLocaleDateString('es-EC', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}
