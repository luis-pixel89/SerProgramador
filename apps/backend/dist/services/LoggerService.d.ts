declare class LoggerService {
    private readonly sentryEnabled;
    private shouldLog;
    private formatEntry;
    private log;
    private captureSentry;
    debug(message: string, context?: string, data?: Record<string, unknown>): void;
    info(message: string, context?: string, data?: Record<string, unknown>): void;
    warn(message: string, context?: string, data?: Record<string, unknown>): void;
    error(message: string, context?: string, data?: Record<string, unknown>, error?: Error): void;
    login(username: string): void;
    reservationCreated(reservationNumber: string, date: string): void;
    reservationDeleted(id: string): void;
    reservationReassigned(id: string, newDate: string): void;
    reservationUpdated(id: string): void;
}
export declare const logger: LoggerService;
export {};
//# sourceMappingURL=LoggerService.d.ts.map