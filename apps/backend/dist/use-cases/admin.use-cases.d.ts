import { AdminRepository, ReservationRepository } from '../repositories/reservation.repository.js';
export declare class LoginAdminUseCase {
    private readonly adminRepository;
    constructor(adminRepository: AdminRepository);
    execute(username: string, password: string): Promise<{
        token: string;
        expiresIn: string;
        admin: {
            id: string;
            username: string;
            role: string;
        };
    }>;
}
export declare class ListReservationsUseCase {
    private readonly reservationRepository;
    constructor(reservationRepository: ReservationRepository);
    execute(filters: {
        month?: number;
        year?: number;
        status?: 'confirmed' | 'cancelled' | 'completed';
        search?: string;
        page?: number;
        limit?: number;
    }): Promise<{
        data: {
            id: string;
            reservationNumber: string;
            reservationDate: string;
            status: import("../shared/types/reservation.types.js").ReservationStatusDto;
            createdAt: string;
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
            } | null;
        }[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
}
export declare class GetReservationUseCase {
    private readonly reservationRepository;
    constructor(reservationRepository: ReservationRepository);
    execute(id: string): Promise<{
        id: string;
        reservationNumber: string;
        reservationDate: string;
        status: import("../shared/types/reservation.types.js").ReservationStatusDto;
        createdAt: string;
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
        } | null;
    }>;
}
export declare class UpdateReservationUseCase {
    private readonly reservationRepository;
    constructor(reservationRepository: ReservationRepository);
    execute(id: string, data: {
        fullName?: string;
        email?: string;
        phone?: string;
        age?: number;
        status?: 'confirmed' | 'cancelled' | 'completed';
    }): Promise<{
        id: string;
        reservationNumber: string;
        reservationDate: string;
        status: import("../shared/types/reservation.types.js").ReservationStatusDto;
        createdAt: string;
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
        } | null;
    }>;
}
export declare class DeleteReservationUseCase {
    private readonly reservationRepository;
    constructor(reservationRepository: ReservationRepository);
    execute(id: string): Promise<void>;
}
export declare class ReassignReservationDateUseCase {
    private readonly reservationRepository;
    constructor(reservationRepository: ReservationRepository);
    execute(id: string, reservationDateKey: string): Promise<{
        id: string;
        reservationNumber: string;
        reservationDate: string;
        status: import("../shared/types/reservation.types.js").ReservationStatusDto;
        createdAt: string;
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
        } | null;
    }>;
}
export declare class GetDashboardUseCase {
    private readonly reservationRepository;
    constructor(reservationRepository: ReservationRepository);
    execute(): Promise<{
        totalReservations: number;
        availableSlots: number;
        fullDates: number;
        reservationsByMonth: Record<string, number>;
        occupancyRate: number;
    }>;
}
//# sourceMappingURL=admin.use-cases.d.ts.map