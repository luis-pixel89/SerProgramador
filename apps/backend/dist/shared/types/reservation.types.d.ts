export type ReservationStatusDto = 'confirmed' | 'cancelled' | 'completed';
export type DayAvailabilityStatusDto = 'available' | 'last-spot' | 'full' | 'weekend' | 'past' | 'disabled';
export interface AvailabilityDayDto {
    date: string;
    bookedCount: number;
    remainingSlots: number;
    maxSlots: number;
    status: DayAvailabilityStatusDto;
    isSelectable: boolean;
}
export interface CreateReservationDto {
    fullName: string;
    email: string;
    phone: string;
    age: number;
    reservationDate: string;
}
export interface CreateReservationResultDto {
    reservationId: string;
    reservationNumber: string;
    ticketNumber: string;
    ticketId: string;
    status: ReservationStatusDto;
}
//# sourceMappingURL=reservation.types.d.ts.map