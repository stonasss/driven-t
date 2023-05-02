import { prisma } from '@/config';

async function findHotels() {
  return prisma.hotel.findMany();
}

async function findRoomsOfHotel(id: number) {
  return prisma.hotel.findFirst({
    where: {
      id,
    },
    include: {
      Rooms: true,
    },
  });
}

async function findRoomByRoomId(roomId: number) {
  return prisma.room.findFirst({
    where: {
      id: roomId,
    },
  });
}

export const hotelsRepository = {
  findHotels,
  findRoomsOfHotel,
  findRoomByRoomId,
};
