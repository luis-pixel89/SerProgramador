import type { AvailabilityDayDto, CreateReservationDto, CreateReservationResultDto } from '../shared/types/reservation.types.js';
import { ReservationRepository, TicketRepository } from '../repositories/reservation.repository.js';
export declare class GetAvailabilityUseCase {
    private readonly reservationRepository;
    constructor(reservationRepository: ReservationRepository);
    execute(filters: {
        month?: number;
        year?: number;
    }): Promise<{
        maxSlotsPerDay: number;
        days: AvailabilityDayDto[];
    }>;
}
export declare class CreateReservationUseCase {
    private readonly reservationRepository;
    constructor(reservationRepository: ReservationRepository);
    execute(input: CreateReservationDto): Promise<CreateReservationResultDto>;
}
export declare class GetTicketUseCase {
    private readonly reservationRepository;
    private readonly ticketRepository;
    constructor(reservationRepository: ReservationRepository, ticketRepository: TicketRepository);
    execute(id: string): Promise<{
        id: string;
        ticketNumber: string;
        reservationId: string;
        reservationNumber: string;
        fullName: string;
        email: string;
        phone: string;
        age: number;
        reservationDate: string;
        status: import("../shared/types/reservation.types.js").ReservationStatusDto;
        qrCode: string | null;
        pdfUrl: string | null;
    }>;
}
//# sourceMappingURL=public.use-cases.d.ts.map