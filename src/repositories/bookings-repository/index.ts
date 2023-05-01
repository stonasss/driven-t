import { prisma } from '@/config';

async function findBookings(userId: number) {
  return prisma.booking.findFirst({
    where: {
      id: userId,
    },
  });
}

async function registerBooking(userId: number, roomId: number) {
  return prisma.booking.create({
    data: {
      roomId,
      userId,
    },
  });
}

export const bookingsRepository = {
  findBookings,
  registerBooking,
};
