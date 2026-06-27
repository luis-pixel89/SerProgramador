import type { Request, Response } from 'express';
export declare const compressionMiddleware: import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
export declare const apiLimiter: import("express-rate-limit").RateLimitRequestHandler;
export declare const authLimiter: import("express-rate-limit").RateLimitRequestHandler;
export declare const etagMiddleware: (req: Request, res: Response, next: () => void) => void;
//# sourceMappingURL=security.middleware.d.ts.map