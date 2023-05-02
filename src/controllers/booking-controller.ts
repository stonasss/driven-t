import { Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import { bookingsService } from '@/services/booking-service';
import { ticketsService } from '@/services/tickets-service';

export async function getBookings(req: AuthenticatedRequest, res: Response) {
  try {
    const { userId } = req;
    const bookings = await bookingsService.getBookingsByUserId(userId);

    return res.status(httpStatus.OK).send(bookings);
  } catch (err) {
    if (err.name === 'NotFoundError') return res.sendStatus(httpStatus.NOT_FOUND);
    return res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
  }
}

export async function createBooking(req: AuthenticatedRequest, res: Response) {
  try {
    const { userId } = req;
    const { roomId } = req.body;

    const tickets = await ticketsService.getTicketsByUserId(userId);
    if (tickets.status !== 'PAID' || tickets.TicketType.isRemote === true || tickets.TicketType.includesHotel !== true)
      return res.sendStatus(httpStatus.FORBIDDEN);

    if (roomId < 1) return res.sendStatus(httpStatus.FORBIDDEN);

    const booking = await bookingsService.createBooking(userId, roomId);
    return res.status(httpStatus.OK).send({ bookingId: booking.id });
  } catch (err) {
    if (err.name === 'NotFoundError') return res.status(httpStatus.NOT_FOUND).send(err.message);
    if (err.name === 'ForbiddenError') return res.status(httpStatus.FORBIDDEN).send(err.message);
    return res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
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
    if (err.name === 'NotFoundError') return res.status(httpStatus.NOT_FOUND).send(err.message);
    if (err.name === 'ForbiddenError') return res.status(httpStatus.FORBIDDEN).send(err.message);
    return res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
  }
}
