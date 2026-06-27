import { env } from '../config/env.js';
const LOG_LEVELS = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3,
};
function getEffectiveLevel() {
    if (env.NODE_ENV === 'production')
        return 'info';
    if (env.NODE_ENV === 'test')
        return 'error';
    return 'debug';
}
class LoggerService {
    sentryEnabled = false;
    shouldLog(level) {
        return LOG_LEVELS[level] >= LOG_LEVELS[getEffectiveLevel()];
    }
    formatEntry(entry) {
        return JSON.stringify(entry);
    }
    log(level, message, context, data, error) {
        if (!this.shouldLog(level))
            return;
        const entry = {
            timestamp: new Date().toISOString(),
            level,
            message,
            ...(context ? { context } : {}),
            ...(data ? { data } : {}),
            ...(error ? { error: { name: error.name, message: error.message, stack: error.stack } } : {}),
        };
        const formatted = this.formatEntry(entry);
        switch (level) {
            case 'error':
                console.error(formatted);
                this.captureSentry(level, entry);
                break;
            case 'warn':
                console.warn(formatted);
                break;
            case 'info':
                console.log(formatted);
                break;
            case 'debug':
                console.debug(formatted);
                break;
        }
    }
    captureSentry(_level, _entry) {
        if (!this.sentryEnabled)
            return;
        // Sentry integration placeholder
        // Sentry.captureEvent({ level, message: entry.message, extra: entry })
    }
    debug(message, context, data) {
        this.log('debug', message, context, data);
    }
    info(message, context, data) {
        this.log('info', message, context, data);
    }
    warn(message, context, data) {
        this.log('warn', message, context, data);
    }
    error(message, context, data, error) {
        this.log('error', message, context, data, error);
    }
    login(username) {
        this.info(`Login exitoso: ${username}`, 'auth');
    }
    reservationCreated(reservationNumber, date) {
        this.info(`Reserva creada: ${reservationNumber}`, 'reservation', { reservationNumber, date });
    }
    reservationDeleted(id) {
        this.info(`Reserva eliminada: ${id}`, 'reservation', { id });
    }
    reservationReassigned(id, newDate) {
        this.info(`Fecha reasignada: ${id} → ${newDate}`, 'reservation', { id, newDate });
    }
    reservationUpdated(id) {
        this.info(`Reserva actualizada: ${id}`, 'reservation', { id });
    }
}
export const logger = new LoggerService();
//# sourceMappingURL=LoggerService.js.map