import { prisma } from '@/config';

async function findBookings(userId: number) {
  return prisma.booking.findFirst({
    where: {
      id: userId,
    },
    select: {
      id: true,
      Room: true,
    },
  });
}

async function findBookingsByRoomId(roomId: number) {
  return prisma.booking.findMany({
    where: {
      roomId: roomId,
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

async function alterBooking(roomId: number, bookingId: number) {
  return prisma.booking.update({
    where: {
      id: bookingId,
    },
    data: {
      roomId,
    },
  });
}

export const bookingsRepository = {
  findBookings,
  registerBooking,
  findBookingsByRoomId,
  alterBooking,
};
