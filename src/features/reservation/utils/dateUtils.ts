export function toDateKey(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function parseDateKey(dateKey: string): Date {
  const [year, month, day] = dateKey.split('-').map(Number)
  return new Date(year, month - 1, day)
}

export function isSameDate(a: Date, b: Date): boolean {
  return toDateKey(a) === toDateKey(b)
}

export function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

export function getMondayBasedWeekdayIndex(date: Date): number {
  const day = date.getDay()
  return day === 0 ? 6 : day - 1
}

export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate()
}

export function createDate(year: number, month: number, day: number): Date {
  return new Date(year, month - 1, day)
}
