import { prisma } from '../config/database.js';
import { formatReservationNumber, formatTicketNumber, parseDateKey, } from '../shared/utils/reservation.utils.js';
export class ReservationRepository {
    async countByDate(date, excludeReservationId) {
        return prisma.reservation.count({
            where: {
                reservationDate: date,
                status: 'CONFIRMED',
                deletedAt: null,
                ...(excludeReservationId ? { id: { not: excludeReservationId } } : {}),
            },
        });
    }
    async countAll() {
        return prisma.reservation.count({ where: { deletedAt: null } });
    }
    async countByStatus(status) {
        return prisma.reservation.count({ where: { status, deletedAt: null } });
    }
    async countByMonth(months, year) {
        const results = await Promise.all(months.map(async (month) => {
            const start = new Date(Date.UTC(year, month - 1, 1));
            const end = new Date(Date.UTC(year, month, 0));
            const count = await prisma.reservation.count({
                where: {
                    status: 'CONFIRMED',
                    deletedAt: null,
                    reservationDate: { gte: start, lte: end },
                },
            });
            const key = `${year}-${String(month).padStart(2, '0')}`;
            return { key, count };
        }));
        return Object.fromEntries(results.map((r) => [r.key, r.count]));
    }
    async findMany(filters) {
        const where = { deletedAt: null };
        if (filters.status) {
            where.status = filters.status;
        }
        if (filters.month && filters.year) {
            const start = new Date(Date.UTC(filters.year, filters.month - 1, 1));
            const end = new Date(Date.UTC(filters.year, filters.month, 0));
            where.reservationDate = { gte: start, lte: end };
        }
        if (filters.search) {
            where.participant = {
                OR: [
                    { fullName: { contains: filters.search, mode: 'insensitive' } },
                    { email: { contains: filters.search, mode: 'insensitive' } },
                    { phone: { contains: filters.search } },
                ],
            };
        }
        const page = filters.page ?? 1;
        const limit = filters.limit ?? 50;
        const skip = (page - 1) * limit;
        const [data, total] = await prisma.$transaction([
            prisma.reservation.findMany({
                where,
                include: {
                    participant: true,
                    ticket: true,
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            }),
            prisma.reservation.count({ where }),
        ]);
        return { data, total };
    }
    async findById(id) {
        return prisma.reservation.findFirst({
            where: { id, deletedAt: null },
            include: {
                participant: true,
                ticket: true,
            },
        });
    }
    async findByEmail(email) {
        return prisma.participant.findFirst({
            where: { email: { equals: email, mode: 'insensitive' } },
        });
    }
    async findActiveByParticipant(participantId) {
        return prisma.reservation.findFirst({
            where: { participantId, status: 'CONFIRMED', deletedAt: null },
        });
    }
    async findByDate(date) {
        return prisma.reservation.findMany({
            where: {
                reservationDate: date,
                status: 'CONFIRMED',
                deletedAt: null,
            },
            include: {
                participant: true,
                ticket: true,
            },
        });
    }
    async create(data, existingParticipantId = null) {
        const reservationDate = parseDateKey(data.reservationDate);
        const participantData = {
            fullName: data.fullName,
            email: data.email.toLowerCase(),
            phone: data.phone,
            age: data.age,
        };
        const [counter] = await prisma.$transaction([
            prisma.reservationCounter.upsert({
                where: { id: 'reservation' },
                create: { id: 'reservation', sequence: 1 },
                update: { sequence: { increment: 1 } },
            }),
        ]);
        if (existingParticipantId) {
            await prisma.participant.update({
                where: { id: existingParticipantId },
                data: participantData,
            });
        }
        return prisma.reservation.create({
            data: {
                reservationDate,
                reservationNumber: formatReservationNumber(counter.sequence),
                status: 'CONFIRMED',
                participant: existingParticipantId
                    ? { connect: { id: existingParticipantId } }
                    : { create: participantData },
                ticket: {
                    create: {
                        ticketNumber: formatTicketNumber(counter.sequence),
                    },
                },
            },
            include: {
                participant: true,
                ticket: true,
            },
        });
    }
    async update(id, data) {
        const reservation = await this.findById(id);
        if (!reservation) {
            throw new Error('Reservation not found');
        }
        return prisma.reservation.update({
            where: { id },
            data: {
                status: data.status,
                participant: data.participant
                    ? {
                        update: data.participant,
                    }
                    : undefined,
            },
            include: {
                participant: true,
                ticket: true,
            },
        });
    }
    async updateDate(id, reservationDate) {
        return prisma.reservation.update({
            where: { id },
            data: { reservationDate },
            include: {
                participant: true,
                ticket: true,
            },
        });
    }
    async delete(id) {
        await prisma.reservation.update({
            where: { id },
            data: { deletedAt: new Date() },
        });
    }
}
export class TicketRepository {
    async findById(id) {
        return prisma.ticket.findUnique({
            where: { id },
            include: {
                reservation: {
                    include: { participant: true },
                },
            },
        });
    }
    async findByReservationId(reservationId) {
        return prisma.ticket.findUnique({
            where: { reservationId },
            include: {
                reservation: {
                    include: { participant: true },
                },
            },
        });
    }
}
//# sourceMappingURL=reservation.repository.js.map