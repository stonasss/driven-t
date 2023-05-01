import { Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import { bookingsService } from '@/services/bookings-service';

export async function getBookings(req: AuthenticatedRequest, res: Response) {
  try {
    const { userId } = req;
    const bookings = await bookingsService.getBookingsByUserId(userId);

    if (!bookings) return res.sendStatus(httpStatus.NOT_FOUND);
    return res.status(httpStatus.OK).send(bookings);
  } catch (err) {
    return res.sendStatus(httpStatus.BAD_REQUEST);
  }
}

export async function createBooking(req: AuthenticatedRequest, res: Response) {
  try {
    const { userId } = req;
    const { roomId } = req.body;

    const booking = await bookingsService.createBooking(userId, roomId);
    if (!roomId) return res.sendStatus(httpStatus.NOT_FOUND);
    return res.status(httpStatus.OK).send(booking.id);
  } catch (err) {
    return res.sendStatus(httpStatus.BAD_REQUEST);
  }
}
