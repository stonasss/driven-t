import { prisma } from '@/config';

async function findHotels() {
  return prisma.hotel.findMany();
}

async function findRoomsOfHotel(roomId: number) {
  return prisma.hotel.findFirst({
    where: {
      id: roomId,
    },
    include: {
      Rooms: true,
    },
  });
}

export const hotelsRepository = {
  findHotels,
  findRoomsOfHotel,
};
