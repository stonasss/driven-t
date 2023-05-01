import { notFoundError } from '@/errors';
import { bookingsRepository } from '@/repositories/bookings-repository';

async function getBookingsByUserId(userId: number) {
  const bookings = await bookingsRepository.findBookings(userId);
  if (!bookings) throw notFoundError();
  return bookings;
}

async function createBooking(userId: number, roomId: number) {
  const booking = await bookingsRepository.registerBooking(userId, roomId);
  if (!roomId) throw notFoundError();
  return booking;
}

export const bookingsService = {
  getBookingsByUserId,
  createBooking,
};
