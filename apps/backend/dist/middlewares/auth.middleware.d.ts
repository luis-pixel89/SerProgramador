import type { NextFunction, Request, Response } from 'express';
export interface AuthPayload {
    sub: string;
    username: string;
    role: string;
}
declare global {
    namespace Express {
        interface Request {
            admin?: AuthPayload;
        }
    }
}
export declare function authMiddleware(req: Request, _res: Response, next: NextFunction): void;
//# sourceMappingURL=auth.middleware.d.ts.map