import { Router } from 'express';
import { AdminController, AuthController, PublicController } from '../controllers/reservation.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
const publicRoutes = Router();
publicRoutes.get('/config', (req, res, next) => {
    PublicController.getConfig(req, res).catch(next);
});
publicRoutes.get('/availability', (req, res, next) => {
    PublicController.getAvailability(req, res).catch(next);
});
publicRoutes.post('/reservations', (req, res, next) => {
    PublicController.createReservation(req, res).catch(next);
});
publicRoutes.get('/ticket/:id', (req, res, next) => {
    PublicController.getTicket(req, res).catch(next);
});
const authRoutes = Router();
authRoutes.post('/login', (req, res, next) => {
    AuthController.login(req, res).catch(next);
});
authRoutes.post('/logout', (_req, res) => {
    res.clearCookie('auth_token', { path: '/' });
    res.json({ message: 'Sesión cerrada' });
});
const adminRoutes = Router();
adminRoutes.use(authMiddleware);
adminRoutes.get('/reservations', (req, res, next) => {
    AdminController.listReservations(req, res).catch(next);
});
adminRoutes.get('/reservations/:id', (req, res, next) => {
    AdminController.getReservation(req, res).catch(next);
});
adminRoutes.put('/reservations/:id', (req, res, next) => {
    AdminController.updateReservation(req, res).catch(next);
});
adminRoutes.delete('/reservations/:id', (req, res, next) => {
    AdminController.deleteReservation(req, res).catch(next);
});
adminRoutes.patch('/reservations/:id/date', (req, res, next) => {
    AdminController.reassignDate(req, res).catch(next);
});
adminRoutes.post('/blocked-dates/:date', (req, res, next) => {
    AdminController.blockDate(req, res).catch(next);
});
adminRoutes.delete('/blocked-dates/:date', (req, res, next) => {
    AdminController.unblockDate(req, res).catch(next);
});
adminRoutes.get('/dashboard', (req, res, next) => {
    AdminController.getDashboard(req, res).catch(next);
});
export { publicRoutes, authRoutes, adminRoutes };
//# sourceMappingURL=index.js.map