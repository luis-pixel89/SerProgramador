import { z } from 'zod';
import { campaignConfig } from '../config/env.js';
const minAllowed = Math.min(...campaignConfig.allowedMonths);
const maxAllowed = Math.max(...campaignConfig.allowedMonths);
export const createReservationSchema = z.object({
    fullName: z.string().trim().min(3).max(80),
    email: z.string().trim().email(),
    phone: z.string().trim().regex(/^\d{10}$/, 'El teléfono debe tener exactamente 10 dígitos.'),
    age: z.coerce.number().int().min(campaignConfig.minAge),
    reservationDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});
export const loginSchema = z.object({
    username: z.string().trim().min(1),
    password: z.string().min(1),
});
export const updateReservationSchema = z.object({
    fullName: z.string().trim().min(3).max(80).optional(),
    email: z.string().trim().email().optional(),
    phone: z.string().trim().regex(/^\d{10}$/).optional(),
    age: z.coerce.number().int().min(campaignConfig.minAge).optional(),
    status: z.enum(['confirmed', 'cancelled', 'completed']).optional(),
});
export const reassignDateSchema = z.object({
    reservationDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});
export const availabilityQuerySchema = z.object({
    month: z.coerce.number().int().min(minAllowed).max(maxAllowed).optional(),
    year: z.coerce.number().int().default(campaignConfig.campaignYear),
});
export const adminReservationsQuerySchema = z.object({
    month: z.coerce.number().int().min(1).max(12).optional(),
    year: z.coerce.number().int().optional(),
    status: z.enum(['confirmed', 'cancelled', 'completed']).optional(),
    search: z.string().trim().optional(),
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(200).default(50),
});
//# sourceMappingURL=reservation.schema.js.map