import { notFoundError, forbiddenError } from '@/errors';
import { bookingsRepository } from '@/repositories/bookings-repository';
import { hotelsRepository } from '@/repositories/hotels-repository';

async function getBookingsByUserId(userId: number) {
  const bookings = await bookingsRepository.findBookings(userId);
  if (!bookings) throw notFoundError();
  return bookings;
}

async function createBooking(userId: number, roomId: number) {
  const room = await hotelsRepository.findRoomByRoomId(roomId);
  if (!room) throw notFoundError();

  const bookings = await bookingsRepository.findBookingsByRoomId(roomId);
  if (bookings.length === room.capacity) throw forbiddenError();

  const booking = await bookingsRepository.registerBooking(userId, roomId);
  if (!roomId) throw notFoundError();
  return booking;
}

async function updateBooking(userId: number, roomId: number, bookingId: number) {
  const room = await hotelsRepository.findRoomByRoomId(roomId);
  const booking = await bookingsRepository.findBookings(userId);

  if (!room || booking) throw forbiddenError();
  if (room.capacity === 0) throw forbiddenError();

  const alteredBooking = await bookingsRepository.alterBooking(roomId, bookingId);
  return alteredBooking;
}

export const bookingsService = {
  getBookingsByUserId,
  createBooking,
  updateBooking,
};
