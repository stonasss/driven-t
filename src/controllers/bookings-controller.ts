import { Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import { bookingsService } from '@/services/bookings-service';

export async function getBookings(req: AuthenticatedRequest, res: Response) {
  try {
    const { userId } = req;
    const bookings = await bookingsService.getBookingsByUserId(userId);

    return res.status(httpStatus.OK).send(bookings);
  } catch (err) {
    if (err.name === 'NotFoundError') return res.sendStatus(httpStatus.NOT_FOUND);
    return res.sendStatus(httpStatus.BAD_REQUEST);
  }
}

export async function createBooking(req: AuthenticatedRequest, res: Response) {
  try {
    const { userId } = req;
    const { roomId } = req.body;

    const booking = await bookingsService.createBooking(userId, roomId);
    if (!roomId) return res.sendStatus(httpStatus.NOT_FOUND);
    return res.status(httpStatus.OK).send({ bookingId: booking.id });
  } catch (err) {
    return res.sendStatus(httpStatus.BAD_REQUEST);
  }
}

export async function alterBooking(req: AuthenticatedRequest, res: Response) {
  try {
    const { userId } = req;
    const { roomId } = req.body;
    const bookingId = Number(req.params.bookingId);

    const booking = await bookingsService.updateBooking(userId, roomId, bookingId);
    return res.status(httpStatus.OK).send({ bookingId: booking.id });
  } catch (err) {
    return res.sendStatus(httpStatus.BAD_REQUEST);
  }
}
