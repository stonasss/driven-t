import { notFoundError } from '@/errors';
import { hotelsRepository } from '@/repositories/hotels-repository';

async function getHotels() {
  const hotels = await hotelsRepository.findHotels();
  if (!hotels) throw notFoundError();

  return hotels;
}

async function getRooms(roomId: number) {
  const rooms = await hotelsRepository.findRoomsOfHotel(roomId);
  if (!rooms) throw notFoundError();

  return rooms;
}

export const hotelsService = {
  getHotels,
  getRooms,
};
