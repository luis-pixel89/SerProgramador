import { ReservationStatus } from '@prisma/client';
import type { ReservationStatusDto } from '../types/reservation.types.js';
export declare function mapReservationStatus(status: ReservationStatus): ReservationStatusDto;
export declare function mapReservationStatusToPrisma(status: ReservationStatusDto): ReservationStatus;
export declare function formatReservationNumber(sequence: number): string;
export declare function formatTicketNumber(sequence: number): string;
export declare function toDateKey(date: Date): string;
export declare function parseDateKey(dateKey: string): Date;
export declare function isWeekend(date: Date): boolean;
export declare function isAllowedMonth(date: Date, allowedMonths: number[]): boolean;
export declare function isPastDate(date: Date, reference?: Date): boolean;
//# sourceMappingURL=reservation.utils.d.ts.map