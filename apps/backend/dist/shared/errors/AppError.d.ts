export declare class AppError extends Error {
    readonly statusCode: number;
    readonly code: string;
    readonly details?: Record<string, unknown>;
    constructor(message: string, statusCode?: number, code?: string, details?: Record<string, unknown>);
}
export declare class ValidationError extends AppError {
    constructor(message: string, details?: Record<string, unknown>);
}
export declare class NotFoundError extends AppError {
    constructor(message?: string);
}
export declare class UnauthorizedError extends AppError {
    constructor(message?: string);
}
export declare class ForbiddenError extends AppError {
    constructor(message?: string);
}
export declare class ConflictError extends AppError {
    constructor(message: string);
}
export declare class InternalServerError extends AppError {
    constructor(message?: string, details?: Record<string, unknown>);
}
//# sourceMappingURL=AppError.d.ts.map