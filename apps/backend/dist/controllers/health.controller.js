import { prisma } from '../config/database.js';
import pkg from '../../package.json' with { type: 'json' };
const { version } = pkg;
const startTime = Date.now();
export function healthCheck(_req, res) {
    res.json({
        status: 'ok',
        service: 'serprogramador-api',
        version,
        uptime: Math.floor((Date.now() - startTime) / 1000),
        timestamp: new Date().toISOString(),
    });
}
export async function readinessCheck(_req, res) {
    try {
        await prisma.$queryRaw `SELECT 1`;
        res.json({
            status: 'ok',
            database: 'connected',
            timestamp: new Date().toISOString(),
        });
    }
    catch {
        res.status(503).json({
            status: 'error',
            database: 'disconnected',
            timestamp: new Date().toISOString(),
        });
    }
}
export function livenessCheck(_req, res) {
    res.status(200).json({
        status: 'alive',
        uptime: Math.floor((Date.now() - startTime) / 1000),
    });
}
//# sourceMappingURL=health.controller.js.map