import { ReservationStatus } from '@prisma/client';
import jwt from 'jsonwebtoken';
import { campaignConfig, env } from '../config/env.js';
import { UnauthorizedError, ConflictError, NotFoundError } from '../shared/errors/AppError.js';
import { isAllowedMonth, isPastDate, isWeekend, mapReservationStatus, mapReservationStatusToPrisma, parseDateKey, toDateKey, } from '../shared/utils/reservation.utils.js';
import { GetAvailabilityUseCase } from './public.use-cases.js';
export class LoginAdminUseCase {
    async execute(username, password) {
        if (username !== env.ADMIN_USERNAME || password !== env.ADMIN_PASSWORD) {
            throw new UnauthorizedError('Credenciales inválidas');
        }
        const token = jwt.sign({ sub: 'admin', username: env.ADMIN_USERNAME, role: 'admin' }, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN });
        return {
            token,
            expiresIn: env.JWT_EXPIRES_IN,
            admin: {
                id: 'admin',
                username: env.ADMIN_USERNAME,
                role: 'admin',
            },
        };
    }
}
export class ListReservationsUseCase {
    reservationRepository;
    constructor(reservationRepository) {
        this.reservationRepository = reservationRepository;
    }
    async execute(filters) {
        const result = await this.reservationRepository.findMany({
            month: filters.month,
            year: filters.year,
            status: filters.status ? mapReservationStatusToPrisma(filters.status) : undefined,
            search: filters.search,
            page: filters.page,
            limit: filters.limit,
        });
        return {
            data: result.data.map(mapReservationDetail),
            total: result.total,
            page: filters.page ?? 1,
            limit: filters.limit ?? 50,
            totalPages: Math.ceil(result.total / (filters.limit ?? 50)),
        };
    }
}
export class GetReservationUseCase {
    reservationRepository;
    constructor(reservationRepository) {
        this.reservationRepository = reservationRepository;
    }
    async execute(id) {
        const reservation = await this.reservationRepository.findById(id);
        if (!reservation) {
            throw new NotFoundError('Reserva no encontrada');
        }
        return mapReservationDetail(reservation);
    }
}
export class UpdateReservationUseCase {
    reservationRepository;
    constructor(reservationRepository) {
        this.reservationRepository = reservationRepository;
    }
    async execute(id, data) {
        const existing = await this.reservationRepository.findById(id);
        if (!existing) {
            throw new NotFoundError('Reserva no encontrada');
        }
        const participantUpdate = {
            ...(data.fullName !== undefined ? { fullName: data.fullName } : {}),
            ...(data.email !== undefined ? { email: data.email } : {}),
            ...(data.phone !== undefined ? { phone: data.phone } : {}),
            ...(data.age !== undefined ? { age: data.age } : {}),
        };
        const updated = await this.reservationRepository.update(id, {
            participant: Object.keys(participantUpdate).length > 0 ? participantUpdate : undefined,
            status: data.status ? mapReservationStatusToPrisma(data.status) : undefined,
        });
        return mapReservationDetail(updated);
    }
}
export class DeleteReservationUseCase {
    reservationRepository;
    constructor(reservationRepository) {
        this.reservationRepository = reservationRepository;
    }
    async execute(id) {
        const existing = await this.reservationRepository.findById(id);
        if (!existing) {
            throw new NotFoundError('Reserva no encontrada');
        }
        await this.reservationRepository.delete(id);
    }
}
export class ReassignReservationDateUseCase {
    reservationRepository;
    constructor(reservationRepository) {
        this.reservationRepository = reservationRepository;
    }
    async execute(id, reservationDateKey) {
        const existing = await this.reservationRepository.findById(id);
        if (!existing) {
            throw new NotFoundError('Reserva no encontrada');
        }
        const reservationDate = parseDateKey(reservationDateKey);
        if (!isAllowedMonth(reservationDate, campaignConfig.allowedMonths)) {
            throw new ConflictError('La fecha destino no está permitida.');
        }
        if (isWeekend(reservationDate)) {
            throw new ConflictError('No se permiten reservas en fines de semana.');
        }
        if (isPastDate(reservationDate)) {
            throw new ConflictError('No se permiten fechas pasadas.');
        }
        const bookedCount = await this.reservationRepository.countByDate(reservationDate, id);
        if (bookedCount >= campaignConfig.maxSlotsPerDay) {
            throw new ConflictError('El día destino no tiene cupos disponibles.');
        }
        const updated = await this.reservationRepository.updateDate(id, reservationDate);
        return mapReservationDetail(updated);
    }
}
export class BlockDateUseCase {
    blockedDateRepository;
    constructor(blockedDateRepository) {
        this.blockedDateRepository = blockedDateRepository;
    }
    async execute(dateKey) {
        const existing = await this.blockedDateRepository.isBlocked(dateKey);
        if (existing) {
            return { blocked: true, date: dateKey };
        }
        await this.blockedDateRepository.create(dateKey);
        return { blocked: true, date: dateKey };
    }
}
export class UnblockDateUseCase {
    blockedDateRepository;
    constructor(blockedDateRepository) {
        this.blockedDateRepository = blockedDateRepository;
    }
    async execute(dateKey) {
        await this.blockedDateRepository.deleteByDate(dateKey);
        return { blocked: false, date: dateKey };
    }
}
export class GetDashboardUseCase {
    reservationRepository;
    blockedDateRepository;
    constructor(reservationRepository, blockedDateRepository) {
        this.reservationRepository = reservationRepository;
        this.blockedDateRepository = blockedDateRepository;
    }
    async execute() {
        const [totalConfirmed, reservationsByMonth, availability] = await Promise.all([
            this.reservationRepository.countByStatus(ReservationStatus.CONFIRMED),
            this.reservationRepository.countByMonth(campaignConfig.allowedMonths, campaignConfig.campaignYear),
            new GetAvailabilityUseCase(this.reservationRepository, this.blockedDateRepository).execute({}),
        ]);
        const selectableDays = availability.days.filter((day) => day.isSelectable);
        const fullDates = selectableDays.filter((day) => day.status === 'full').length;
        const availableSlots = selectableDays.reduce((total, day) => total + day.remainingSlots, 0);
        const totalCapacity = selectableDays.length * campaignConfig.maxSlotsPerDay;
        const bookedSlots = selectableDays.reduce((total, day) => total + day.bookedCount, 0);
        const occupancyRate = totalCapacity > 0 ? Number(((bookedSlots / totalCapacity) * 100).toFixed(2)) : 0;
        return {
            totalReservations: totalConfirmed,
            availableSlots,
            fullDates,
            reservationsByMonth,
            occupancyRate,
        };
    }
}
function mapReservationDetail(reservation) {
    return {
        id: reservation.id,
        reservationNumber: reservation.reservationNumber,
        reservationDate: toDateKey(reservation.reservationDate),
        status: mapReservationStatus(reservation.status),
        createdAt: reservation.createdAt.toISOString(),
        participant: {
            id: reservation.participant.id,
            fullName: reservation.participant.fullName,
            email: reservation.participant.email,
            phone: reservation.participant.phone,
            age: reservation.participant.age,
        },
        ticket: reservation.ticket
            ? {
                id: reservation.ticket.id,
                ticketNumber: reservation.ticket.ticketNumber,
            }
            : null,
    };
}
//# sourceMappingURL=admin.use-cases.js.map