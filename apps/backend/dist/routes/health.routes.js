import { Router } from 'express';
import { healthCheck, readinessCheck, livenessCheck } from '../controllers/health.controller.js';
export const healthRoutes = Router();
healthRoutes.get('/', healthCheck);
healthRoutes.get('/ready', readinessCheck);
healthRoutes.get('/live', livenessCheck);
//# sourceMappingURL=health.routes.js.map