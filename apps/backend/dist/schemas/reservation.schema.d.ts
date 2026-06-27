import { z } from 'zod';
export declare const createReservationSchema: z.ZodObject<{
    fullName: z.ZodString;
    email: z.ZodString;
    phone: z.ZodString;
    age: z.ZodCoercedNumber<unknown>;
    reservationDate: z.ZodString;
}, z.core.$strip>;
export declare const loginSchema: z.ZodObject<{
    username: z.ZodString;
    password: z.ZodString;
}, z.core.$strip>;
export declare const updateReservationSchema: z.ZodObject<{
    fullName: z.ZodOptional<z.ZodString>;
    email: z.ZodOptional<z.ZodString>;
    phone: z.ZodOptional<z.ZodString>;
    age: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
    status: z.ZodOptional<z.ZodEnum<{
        confirmed: "confirmed";
        cancelled: "cancelled";
        completed: "completed";
    }>>;
}, z.core.$strip>;
export declare const reassignDateSchema: z.ZodObject<{
    reservationDate: z.ZodString;
}, z.core.$strip>;
export declare const availabilityQuerySchema: z.ZodObject<{
    month: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
    year: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
}, z.core.$strip>;
export declare const adminReservationsQuerySchema: z.ZodObject<{
    month: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
    year: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
    status: z.ZodOptional<z.ZodEnum<{
        confirmed: "confirmed";
        cancelled: "cancelled";
        completed: "completed";
    }>>;
    search: z.ZodOptional<z.ZodString>;
    page: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    limit: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
}, z.core.$strip>;
//# sourceMappingURL=reservation.schema.d.ts.map