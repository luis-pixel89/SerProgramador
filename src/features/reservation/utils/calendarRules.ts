import { getMondayBasedWeekdayIndex } from './dateUtils'

export function isWeekend(date: Date): boolean {
  const day = date.getDay()
  return day === 0 || day === 6
}

export function isPastDate(date: Date, referenceDate: Date = new Date()): boolean {
  const target = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  const reference = new Date(
    referenceDate.getFullYear(),
    referenceDate.getMonth(),
    referenceDate.getDate(),
  )
  return target < reference
}

export function isAllowedMonth(date: Date, allowedMonths: number[]): boolean {
  return allowedMonths.includes(date.getMonth() + 1)
}

export function isBusinessDay(date: Date, allowedMonths: number[]): boolean {
  return !isWeekend(date) && isAllowedMonth(date, allowedMonths)
}

export function generateBusinessDays(year: number, month: number, allowedMonths: number[]): Date[] {
  const daysInMonth = new Date(year, month, 0).getDate()
  const businessDays: Date[] = []

  for (let day = 1; day <= daysInMonth; day += 1) {
    const date = new Date(year, month - 1, day)
    if (isBusinessDay(date, allowedMonths)) {
      businessDays.push(date)
    }
  }

  return businessDays
}

export function getMonthGridOffset(year: number, month: number): number {
  const firstDay = new Date(year, month - 1, 1)
  return getMondayBasedWeekdayIndex(firstDay)
}
