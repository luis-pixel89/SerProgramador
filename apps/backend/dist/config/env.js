import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
if (process.env.NODE_ENV !== 'production') {
    dotenv.config({ path: path.resolve(__dirname, '../../.env') });
}
import { z } from 'zod';
const envSchema = z.object({
    DATABASE_URL: z.string().min(1),
    PORT: z.coerce.number().default(3001),
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    JWT_SECRET: z.string().min(16),
    JWT_EXPIRES_IN: z.string().default('8h'),
    CORS_ORIGIN: z.string().default('http://localhost:5173'),
    MAX_SLOTS_PER_DAY: z.coerce.number().default(2),
    CAMPAIGN_YEAR: z.coerce.number().default(2026),
    ALLOWED_MONTHS: z.string().default('7,8'),
    MIN_AGE: z.coerce.number().default(15),
    ADMIN_USERNAME: z.string().default('admin'),
    ADMIN_PASSWORD: z.string().default('admin123'),
});
const parsed = envSchema.safeParse(process.env);
if (!parsed.success) {
    console.error('Invalid environment variables:', parsed.error.flatten().fieldErrors);
    process.exit(1);
}
export const env = parsed.data;
export const campaignConfig = {
    maxSlotsPerDay: env.MAX_SLOTS_PER_DAY,
    campaignYear: env.CAMPAIGN_YEAR,
    allowedMonths: env.ALLOWED_MONTHS.split(',').map(Number),
    minAge: env.MIN_AGE,
};
//# sourceMappingURL=env.js.map