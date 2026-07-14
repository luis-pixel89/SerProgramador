import { prisma } from '../config/database.js';

export class AdvisorRepository {
    async findAll() {
        return prisma.advisor.findMany({ orderBy: { name: 'asc' } });
    }

    async findByName(name) {
        return prisma.advisor.findUnique({ where: { name } });
    }
}
