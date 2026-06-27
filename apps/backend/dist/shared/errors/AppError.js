export class AppError extends Error {
    statusCode;
    code;
    details;
    constructor(message, statusCode = 500, code = 'INTERNAL_ERROR', details) {
        super(message);
        this.name = 'AppError';
        this.statusCode = statusCode;
        this.code = code;
        this.details = details;
    }
}
export class ValidationError extends AppError {
    constructor(message, details) {
        super(message, 400, 'VALIDATION_ERROR', details);
        this.name = 'ValidationError';
    }
}
export class NotFoundError extends AppError {
    constructor(message = 'Recurso no encontrado') {
        super(message, 404, 'NOT_FOUND');
        this.name = 'NotFoundError';
    }
}
export class UnauthorizedError extends AppError {
    constructor(message = 'No autorizado') {
        super(message, 401, 'UNAUTHORIZED');
        this.name = 'UnauthorizedError';
    }
}
export class ForbiddenError extends AppError {
    constructor(message = 'Acceso denegado') {
        super(message, 403, 'FORBIDDEN');
        this.name = 'ForbiddenError';
    }
}
export class ConflictError extends AppError {
    constructor(message) {
        super(message, 409, 'CONFLICT');
        this.name = 'ConflictError';
    }
}
export class InternalServerError extends AppError {
    constructor(message = 'Error interno del servidor', details) {
        super(message, 500, 'INTERNAL_ERROR', details);
        this.name = 'InternalServerError';
    }
}
//# sourceMappingURL=AppError.js.map