import { createApp } from './app.js';
import { connectDatabase, disconnectDatabase } from './config/database.js';
import { env } from './config/env.js';
import { logger } from './services/LoggerService.js';
async function bootstrap() {
    logger.info('Starting server...', 'bootstrap');
    await connectDatabase();
    logger.info('Database connected', 'bootstrap');
    const app = createApp();
    const server = app.listen(env.PORT, () => {
        logger.info(`Server listening on port ${env.PORT}`, 'bootstrap', {
            port: env.PORT,
            environment: env.NODE_ENV,
            corsOrigin: env.CORS_ORIGIN,
        });
    });
    const shutdown = async (signal) => {
        logger.info(`Received ${signal}, shutting down gracefully...`, 'shutdown');
        server.close();
        await disconnectDatabase();
        logger.info('Shutdown complete', 'shutdown');
        process.exit(0);
    };
    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('unhandledRejection', (reason) => {
        logger.error('Unhandled rejection', 'process', {}, reason instanceof Error ? reason : new Error(String(reason)));
    });
    process.on('uncaughtException', (error) => {
        logger.error('Uncaught exception', 'process', {}, error);
        process.exit(1);
    });
}
bootstrap().catch((error) => {
    logger.error('Failed to start server', 'bootstrap', {}, error instanceof Error ? error : new Error(String(error)));
    process.exit(1);
});
//# sourceMappingURL=server.js.map