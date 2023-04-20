import { prisma } from '@/config';

async function findHotels() {
  return prisma.ticket.findMany();
}

export const hotelsRepository = {
  findHotels,
};
