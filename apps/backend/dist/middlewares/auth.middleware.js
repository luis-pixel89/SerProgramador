import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { UnauthorizedError } from '../shared/errors/AppError.js';
function extractToken(req) {
    const header = req.headers.authorization;
    if (header?.startsWith('Bearer ')) {
        return header.slice(7);
    }
    if (req.cookies?.auth_token) {
        return req.cookies.auth_token;
    }
    return null;
}
export function authMiddleware(req, _res, next) {
    const token = extractToken(req);
    if (!token) {
        next(new UnauthorizedError('Token requerido'));
        return;
    }
    try {
        const payload = jwt.verify(token, env.JWT_SECRET);
        req.admin = payload;
        next();
    }
    catch {
        next(new UnauthorizedError('Token inválido o expirado'));
    }
}
//# sourceMappingURL=auth.middleware.js.map