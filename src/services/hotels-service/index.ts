import { hotelsRepository } from '@/repositories/hotels-repository';

async function getHotels() {
  const hotels = await hotelsRepository.findHotels();
  return hotels;
}

export const hotelsService = {
  getHotels,
};
