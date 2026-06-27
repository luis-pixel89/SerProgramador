import { blockDateUseCase, createReservationUseCase, deleteReservationUseCase, getAvailabilityUseCase, getDashboardUseCase, getReservationUseCase, getTicketUseCase, listReservationsUseCase, loginAdminUseCase, reassignReservationDateUseCase, unblockDateUseCase, updateReservationUseCase, } from '../config/container.js';
import { campaignConfig, env } from '../config/env.js';
import { adminReservationsQuerySchema, availabilityQuerySchema, createReservationSchema, loginSchema, reassignDateSchema, updateReservationSchema, } from '../schemas/reservation.schema.js';
import { getRouteParam } from '../shared/utils/http.utils.js';
import { logger } from '../services/LoggerService.js';
export class PublicController {
    static async getConfig(_req, res) {
        res.json(campaignConfig);
    }
    static async getAvailability(req, res) {
        const query = availabilityQuerySchema.parse(req.query);
        const result = await getAvailabilityUseCase.execute(query);
        res.json(result);
    }
    static async createReservation(req, res) {
        const body = createReservationSchema.parse(req.body);
        const result = await createReservationUseCase.execute(body);
        logger.reservationCreated(result.reservationNumber, body.reservationDate);
        res.status(201).json(result);
    }
    static async getTicket(req, res) {
        const result = await getTicketUseCase.execute(getRouteParam(req.params.id));
        res.json(result);
    }
}
export class AuthController {
    static async login(req, res) {
        const body = loginSchema.parse(req.body);
        const result = await loginAdminUseCase.execute(body.username, body.password);
        logger.login(body.username);
        res.cookie('auth_token', result.token, {
            httpOnly: true,
            secure: env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 8 * 60 * 60 * 1000,
        });
        res.json(result);
    }
}
export class AdminController {
    static async getReservation(req, res) {
        const result = await getReservationUseCase.execute(getRouteParam(req.params.id));
        res.json(result);
    }
    static async listReservations(req, res) {
        const query = adminReservationsQuerySchema.parse(req.query);
        const result = await listReservationsUseCase.execute(query);
        res.json(result);
    }
    static async updateReservation(req, res) {
        const body = updateReservationSchema.parse(req.body);
        const result = await updateReservationUseCase.execute(getRouteParam(req.params.id), body);
        logger.reservationUpdated(result.id);
        res.json(result);
    }
    static async deleteReservation(req, res) {
        const id = getRouteParam(req.params.id);
        await deleteReservationUseCase.execute(id);
        logger.reservationDeleted(id);
        res.status(204).send();
    }
    static async reassignDate(req, res) {
        const id = getRouteParam(req.params.id);
        const body = reassignDateSchema.parse(req.body);
        const result = await reassignReservationDateUseCase.execute(id, body.reservationDate);
        logger.reservationReassigned(id, body.reservationDate);
        res.json(result);
    }
    static async getDashboard(_req, res) {
        const result = await getDashboardUseCase.execute();
        res.json(result);
    }
    static async blockDate(req, res) {
        const { date } = req.params;
        const result = await blockDateUseCase.execute(date);
        logger.reservationUpdated(`Bloqueada fecha ${date}`);
        res.json(result);
    }
    static async unblockDate(req, res) {
        const { date } = req.params;
        const result = await unblockDateUseCase.execute(date);
        logger.reservationUpdated(`Desbloqueada fecha ${date}`);
        res.json(result);
    }
}
//# sourceMappingURL=reservation.controller.js.map