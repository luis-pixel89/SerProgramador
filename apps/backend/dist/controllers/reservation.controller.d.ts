import type { Request, Response } from 'express';
export declare class PublicController {
    static getAvailability(req: Request, res: Response): Promise<void>;
    static createReservation(req: Request, res: Response): Promise<void>;
    static getTicket(req: Request, res: Response): Promise<void>;
}
export declare class AuthController {
    static login(req: Request, res: Response): Promise<void>;
}
export declare class AdminController {
    static getReservation(req: Request, res: Response): Promise<void>;
    static listReservations(req: Request, res: Response): Promise<void>;
    static updateReservation(req: Request, res: Response): Promise<void>;
    static deleteReservation(req: Request, res: Response): Promise<void>;
    static reassignDate(req: Request, res: Response): Promise<void>;
    static getDashboard(_req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=reservation.controller.d.ts.map