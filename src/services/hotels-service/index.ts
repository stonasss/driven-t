import { notFoundError } from '@/errors';
import { hotelsRepository } from '@/repositories/hotels-repository';

async function getHotels() {
  const hotels = await hotelsRepository.findHotels();
  if (hotels.length === 0) throw notFoundError();

  return hotels;
}

async function getRooms(id: number) {
  const rooms = await hotelsRepository.findRoomsOfHotel(id);
  if (!rooms) throw notFoundError();

  return rooms;
}

export const hotelsService = {
  getHotels,
  getRooms,
};
