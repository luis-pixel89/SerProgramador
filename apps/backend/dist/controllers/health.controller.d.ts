import type { Request, Response } from 'express';
export declare function healthCheck(_req: Request, res: Response): void;
export declare function readinessCheck(_req: Request, res: Response): Promise<void>;
export declare function livenessCheck(_req: Request, res: Response): void;
//# sourceMappingURL=health.controller.d.ts.map