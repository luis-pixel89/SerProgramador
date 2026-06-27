import { prisma } from '../config/database.js';

export class BlockedDateRepository {
  async isBlocked(dateKey) {
    const date = new Date(dateKey + 'T12:00:00');
    const found = await prisma.blockedDate.findUnique({
      where: { date },
    });
    return !!found;
  }

  async create(dateKey) {
    const date = new Date(dateKey + 'T12:00:00');
    return prisma.blockedDate.create({
      data: { date },
    });
  }

  async deleteByDate(dateKey) {
    const date = new Date(dateKey + 'T12:00:00');
    return prisma.blockedDate.delete({
      where: { date },
    });
  }

  async findAll() {
    return prisma.blockedDate.findMany();
  }
}
