import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import { env } from './config/env.js';
import { errorHandler, notFoundHandler } from './middlewares/error.middleware.js';
import { compressionMiddleware, apiLimiter, authLimiter } from './middlewares/security.middleware.js';
import { adminRoutes, authRoutes, publicRoutes } from './routes/index.js';
import { healthRoutes } from './routes/health.routes.js';
export function createApp() {
    const app = express();
    app.set('trust proxy', env.NODE_ENV === 'production' ? 1 : 0);
    app.use(helmet({
        crossOriginResourcePolicy: { policy: 'cross-origin' },
        contentSecurityPolicy: false,
    }));
    app.use(compressionMiddleware);
    app.use(cors({
        origin: env.CORS_ORIGIN.split(',').map((o) => o.trim()),
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
    }));
    app.use(cookieParser());
    app.use(express.json({ limit: '1mb' }));
    app.use('/health', healthRoutes);
    app.use('/api/v1', apiLimiter, publicRoutes);
    app.use('/api/v1/auth', authLimiter, authRoutes);
    app.use('/api/v1/admin', apiLimiter, adminRoutes);
    app.use(notFoundHandler);
    app.use(errorHandler);
    return app;
}
//# sourceMappingURL=app.js.map