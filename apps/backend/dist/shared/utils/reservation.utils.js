import { ReservationStatus } from '@prisma/client';
export function mapReservationStatus(status) {
    switch (status) {
        case ReservationStatus.CONFIRMED:
            return 'confirmed';
        case ReservationStatus.CANCELLED:
            return 'cancelled';
        case ReservationStatus.COMPLETED:
            return 'completed';
        default:
            return 'confirmed';
    }
}
export function mapReservationStatusToPrisma(status) {
    switch (status) {
        case 'confirmed':
            return ReservationStatus.CONFIRMED;
        case 'cancelled':
            return ReservationStatus.CANCELLED;
        case 'completed':
            return ReservationStatus.COMPLETED;
        default:
            return ReservationStatus.CONFIRMED;
    }
}
export function formatReservationNumber(sequence) {
    return `RES-${String(sequence).padStart(5, '0')}`;
}
export function formatTicketNumber(sequence) {
    return `TCK-${String(sequence).padStart(5, '0')}`;
}
export function toDateKey(date) {
    return date.toISOString().slice(0, 10);
}
export function parseDateKey(dateKey) {
    const [year, month, day] = dateKey.split('-').map(Number);
    return new Date(Date.UTC(year, month - 1, day));
}
export function isWeekend(date) {
    const day = date.getUTCDay();
    return day === 0 || day === 6;
}
export function isAllowedMonth(date, allowedMonths) {
    return allowedMonths.includes(date.getUTCMonth() + 1);
}
export function isPastDate(date, reference = new Date()) {
    const dateOnly = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
    const refOnly = Date.UTC(reference.getUTCFullYear(), reference.getUTCMonth(), reference.getUTCDate());
    return dateOnly < refOnly;
}
//# sourceMappingURL=reservation.utils.js.map