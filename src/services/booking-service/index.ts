import { notFoundError, forbiddenError } from '@/errors';
import { bookingsRepository } from '@/repositories/bookings-repository';
import { hotelsRepository } from '@/repositories/hotels-repository';

async function getBookingsByUserId(userId: number) {
  const bookings = await bookingsRepository.findBookings(userId);
  if (!bookings) throw notFoundError();
  return bookings;
}

async function createBooking(userId: number, roomId: number) {
  const vacancies = await bookingsRepository.checkVacancies(roomId);
  const room = await hotelsRepository.findRoomByRoomId(roomId);

  if (!room) throw notFoundError();
  if (vacancies === 0) throw forbiddenError();

  const booking = await bookingsRepository.registerBooking(userId, roomId);
  if (!roomId) throw notFoundError();
  return booking;
}

async function updateBooking(userId: number, roomId: number, bookingId: number) {
  const room = await hotelsRepository.findRoomByRoomId(roomId);
  if (!room) throw notFoundError();
  const booking = await bookingsRepository.findBookings(userId);
  const vacancies = await bookingsRepository.checkVacancies(roomId);

  if (!booking) throw forbiddenError();
  if (vacancies === 0) throw forbiddenError();

  const alteredBooking = await bookingsRepository.alterBooking(roomId, bookingId);
  return alteredBooking;
}

export const bookingsService = {
  getBookingsByUserId,
  createBooking,
  updateBooking,
};
