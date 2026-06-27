import { campaignConfig } from '../config/env.js';
import { ConflictError, NotFoundError, ValidationError } from '../shared/errors/AppError.js';
import { isAllowedMonth, isPastDate, isWeekend, mapReservationStatus, parseDateKey, toDateKey, } from '../shared/utils/reservation.utils.js';
export class GetAvailabilityUseCase {
    reservationRepository;
    blockedDateRepository;
    constructor(reservationRepository, blockedDateRepository) {
        this.reservationRepository = reservationRepository;
        this.blockedDateRepository = blockedDateRepository;
    }
    async execute(filters) {
        const year = filters.year ?? campaignConfig.campaignYear;
        const months = filters.month ? [filters.month] : campaignConfig.allowedMonths;
        const days = [];
        const referenceDate = new Date();
        for (const month of months) {
            const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();
            for (let day = 1; day <= daysInMonth; day += 1) {
                const date = new Date(Date.UTC(year, month - 1, day));
                const dateKey = toDateKey(date);
                const isBlocked = this.blockedDateRepository
                    ? await this.blockedDateRepository.isBlocked(dateKey)
                    : false;
                let bookedCount = await this.reservationRepository.countByDate(date);
                if (isBlocked) {
                    bookedCount = campaignConfig.maxSlotsPerDay;
                }
                const remainingSlots = Math.max(campaignConfig.maxSlotsPerDay - bookedCount, 0);
                let status = 'available';
                let isSelectable = true;
                if (!isAllowedMonth(date, campaignConfig.allowedMonths)) {
                    status = 'disabled';
                    isSelectable = false;
                }
                else if (isWeekend(date)) {
                    status = 'weekend';
                    isSelectable = false;
                }
                else if (isPastDate(date, referenceDate)) {
                    status = 'past';
                    isSelectable = false;
                }
                else if (bookedCount >= campaignConfig.maxSlotsPerDay) {
                    status = 'full';
                    isSelectable = false;
                }
                else if (remainingSlots === 1) {
                    status = 'last-spot';
                }
                days.push({
                    date: dateKey,
                    bookedCount,
                    remainingSlots,
                    maxSlots: campaignConfig.maxSlotsPerDay,
                    status,
                    isSelectable,
                    isBlocked,
                });
            }
        }
        return {
            maxSlotsPerDay: campaignConfig.maxSlotsPerDay,
            days,
        };
    }
}
export class CreateReservationUseCase {
    reservationRepository;
    blockedDateRepository;
    constructor(reservationRepository, blockedDateRepository) {
        this.reservationRepository = reservationRepository;
        this.blockedDateRepository = blockedDateRepository;
    }
    async execute(input) {
        const reservationDate = parseDateKey(input.reservationDate);
        if (!isAllowedMonth(reservationDate, campaignConfig.allowedMonths)) {
            throw new ValidationError('La fecha no pertenece a los meses permitidos.');
        }
        if (isWeekend(reservationDate)) {
            throw new ValidationError('No se permiten reservas en fines de semana.');
        }
        if (isPastDate(reservationDate)) {
            throw new ValidationError('No se permiten reservas en fechas pasadas.');
        }
        const existingParticipant = await this.reservationRepository.findByEmail(input.email);
        if (existingParticipant) {
            const activeReservation = await this.reservationRepository.findActiveByParticipant(existingParticipant.id);
            if (activeReservation) {
                throw new ConflictError('Ya existe una reserva para esta persona');
            }
        }
        const [bookedCount, isBlocked] = await Promise.all([
            this.reservationRepository.countByDate(reservationDate),
            this.blockedDateRepository
                ? this.blockedDateRepository.isBlocked(input.reservationDate)
                : Promise.resolve(false),
        ]);
        if (isBlocked) {
            throw new ConflictError('El día seleccionado ya no tiene cupos disponibles.');
        }
        if (bookedCount >= campaignConfig.maxSlotsPerDay) {
            throw new ConflictError('El día seleccionado ya no tiene cupos disponibles.');
        }
        const reservation = await this.reservationRepository.create(input, existingParticipant?.id);
        if (!reservation.ticket) {
            throw new Error('Ticket was not created');
        }
        return {
            reservationId: reservation.id,
            reservationNumber: reservation.reservationNumber,
            ticketNumber: reservation.ticket.ticketNumber,
            ticketId: reservation.ticket.id,
            status: mapReservationStatus(reservation.status),
        };
    }
}
export class GetTicketUseCase {
    reservationRepository;
    ticketRepository;
    constructor(reservationRepository, ticketRepository) {
        this.reservationRepository = reservationRepository;
        this.ticketRepository = ticketRepository;
    }
    async execute(id) {
        const ticket = await this.ticketRepository.findById(id);
        if (ticket) {
            return {
                id: ticket.id,
                ticketNumber: ticket.ticketNumber,
                reservationId: ticket.reservation.id,
                reservationNumber: ticket.reservation.reservationNumber,
                fullName: ticket.reservation.participant.fullName,
                email: ticket.reservation.participant.email,
                phone: ticket.reservation.participant.phone,
                age: ticket.reservation.participant.age,
                reservationDate: toDateKey(ticket.reservation.reservationDate),
                status: mapReservationStatus(ticket.reservation.status),
                qrCode: ticket.qrCode,
                pdfUrl: ticket.pdfUrl,
            };
        }
        const byReservation = await this.reservationRepository.findById(id);
        if (byReservation?.ticket) {
            return {
                id: byReservation.ticket.id,
                ticketNumber: byReservation.ticket.ticketNumber,
                reservationId: byReservation.id,
                reservationNumber: byReservation.reservationNumber,
                fullName: byReservation.participant.fullName,
                email: byReservation.participant.email,
                phone: byReservation.participant.phone,
                age: byReservation.participant.age,
                reservationDate: toDateKey(byReservation.reservationDate),
                status: mapReservationStatus(byReservation.status),
                qrCode: byReservation.ticket.qrCode,
                pdfUrl: byReservation.ticket.pdfUrl,
            };
        }
        throw new NotFoundError('Ticket no encontrado');
    }
}
//# sourceMappingURL=public.use-cases.js.map