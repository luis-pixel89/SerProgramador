import 'dotenv/config';
export declare const env: {
    DATABASE_URL: string;
    PORT: number;
    NODE_ENV: "development" | "production" | "test";
    JWT_SECRET: string;
    JWT_EXPIRES_IN: string;
    CORS_ORIGIN: string;
    MAX_SLOTS_PER_DAY: number;
    CAMPAIGN_YEAR: number;
    ALLOWED_MONTHS: string;
    MIN_AGE: number;
    ADMIN_USERNAME: string;
    ADMIN_PASSWORD: string;
};
export declare const campaignConfig: {
    readonly maxSlotsPerDay: number;
    readonly campaignYear: number;
    readonly allowedMonths: number[];
    readonly minAge: number;
};
//# sourceMappingURL=env.d.ts.map