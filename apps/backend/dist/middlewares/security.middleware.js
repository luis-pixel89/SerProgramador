import compression from 'compression';
import rateLimit from 'express-rate-limit';
export const compressionMiddleware = compression({
    level: 6,
    threshold: 1024,
    filter: (req, res) => {
        if (req.headers['x-no-compression'])
            return false;
        return compression.filter(req, res);
    },
});
export const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        message: 'Demasiadas solicitudes. Intenta de nuevo en 15 minutos.',
        code: 'RATE_LIMIT_EXCEEDED',
    },
});
export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        message: 'Demasiados intentos de inicio de sesión. Intenta de nuevo en 15 minutos.',
        code: 'RATE_LIMIT_EXCEEDED',
    },
});

//# sourceMappingURL=security.middleware.js.map