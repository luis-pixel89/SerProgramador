import { ZodError } from 'zod';
import { AppError, ValidationError } from '../shared/errors/AppError.js';
import { logger } from '../services/LoggerService.js';
export function errorHandler(error, req, res, _next) {
    if (error instanceof ZodError) {
        res.status(400).json({
            message: 'Error de validación',
            code: 'VALIDATION_ERROR',
            details: error.flatten().fieldErrors,
        });
        return;
    }
    if (error instanceof ValidationError) {
        res.status(error.statusCode).json({
            message: error.message,
            code: error.code,
            details: error.details,
        });
        return;
    }
    if (error instanceof AppError) {
        if (error.statusCode >= 500) {
            logger.error(error.message, 'http', { method: req.method, path: req.path }, error);
        }
        res.status(error.statusCode).json({
            message: error.message,
            code: error.code,
            details: error.details,
        });
        return;
    }
    const message = error instanceof Error ? error.message : 'Error interno del servidor';
    logger.error(message, 'http', { method: req.method, path: req.path }, error instanceof Error ? error : undefined);
    res.status(500).json({
        message: 'Error interno del servidor',
        code: 'INTERNAL_ERROR',
    });
}
export function notFoundHandler(_req, res) {
    res.status(404).json({
        message: 'Ruta no encontrada',
        code: 'NOT_FOUND',
    });
}
//# sourceMappingURL=error.middleware.js.map