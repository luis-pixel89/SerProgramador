import type { Reservation, ReservationStatus } from '@prisma/client';
import type { CreateReservationDto } from '../shared/types/reservation.types.js';
export type ReservationWithRelations = Reservation & {
    participant: {
        id: string;
        fullName: string;
        email: string;
        phone: string;
        age: number;
    };
    ticket: {
        id: string;
        ticketNumber: string;
        qrCode: string | null;
        pdfUrl: string | null;
    } | null;
};
export declare class ReservationRepository {
    countByDate(date: Date, excludeReservationId?: string): Promise<number>;
    countAll(): Promise<number>;
    countByStatus(status: ReservationStatus): Promise<number>;
    countByMonth(months: number[], year: number): Promise<Record<string, number>>;
    findMany(filters: {
        month?: number;
        year?: number;
        status?: ReservationStatus;
        search?: string;
        page?: number;
        limit?: number;
    }): Promise<{
        data: ReservationWithRelations[];
        total: number;
    }>;
    findById(id: string): Promise<ReservationWithRelations | null>;
    findByDate(date: Date): Promise<ReservationWithRelations[]>;
    create(data: CreateReservationDto): Promise<ReservationWithRelations>;
    update(id: string, data: {
        participant?: Partial<{
            fullName: string;
            email: string;
            phone: string;
            age: number;
        }>;
        status?: ReservationStatus;
    }): Promise<ReservationWithRelations>;
    updateDate(id: string, reservationDate: Date): Promise<ReservationWithRelations>;
    delete(id: string): Promise<void>;
}
export declare class TicketRepository {
    findById(id: string): Promise<({
        reservation: {
            participant: {
                id: string;
                createdAt: Date;
                fullName: string;
                email: string;
                phone: string;
                age: number;
            };
        } & {
            reservationNumber: string;
            id: string;
            participantId: string;
            reservationDate: Date;
            status: import("@prisma/client").$Enums.ReservationStatus;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
        };
    } & {
        id: string;
        createdAt: Date;
        reservationId: string;
        ticketNumber: string;
        qrCode: string | null;
        pdfUrl: string | null;
    }) | null>;
    findByReservationId(reservationId: string): Promise<({
        reservation: {
            participant: {
                id: string;
                createdAt: Date;
                fullName: string;
                email: string;
                phone: string;
                age: number;
            };
        } & {
            reservationNumber: string;
            id: string;
            participantId: string;
            reservationDate: Date;
            status: import("@prisma/client").$Enums.ReservationStatus;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
        };
    } & {
        id: string;
        createdAt: Date;
        reservationId: string;
        ticketNumber: string;
        qrCode: string | null;
        pdfUrl: string | null;
    }) | null>;
}
export declare class AdminRepository {
    findByUsername(username: string): Promise<{
        id: string;
        createdAt: Date;
        username: string;
        passwordHash: string;
        role: import("@prisma/client").$Enums.AdminRole;
    } | null>;
}
//# sourceMappingURL=reservation.repository.d.ts.map