import { Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import { hotelsService } from '@/services';
import { ticketsService } from '@/services/tickets-service';

export async function getHotels(req: AuthenticatedRequest, res: Response) {
  try {
    const { userId } = req;
    const tickets = await ticketsService.getTicketsByUserId(userId);
    if (
      tickets.status !== 'PAID' ||
      tickets.TicketType.isRemote === true ||
      tickets.TicketType.includesHotel !== true
    ) {
      return res.sendStatus(httpStatus.PAYMENT_REQUIRED);
    }

    const hotels = await hotelsService.getHotels();
    return res.status(httpStatus.OK).send(hotels);
  } catch (err) {
    return res.sendStatus(httpStatus.BAD_REQUEST);
  }
}

export async function getRoomsByHotelId(req: AuthenticatedRequest, res: Response) {
  try {
    const { userId } = req;
    const roomId = Number(req.params.hotelId);

    const tickets = await ticketsService.getTicketsByUserId(userId);
    if (
      tickets.status !== 'PAID' ||
      tickets.TicketType.isRemote === true ||
      tickets.TicketType.includesHotel !== true
    ) {
      return res.sendStatus(httpStatus.PAYMENT_REQUIRED);
    }

    const rooms = await hotelsService.getRooms(roomId);
    return res.status(httpStatus.OK).send(rooms);
  } catch (err) {
    if (err.name === 'NotFoundError') return res.sendStatus(httpStatus.NOT_FOUND);
    return res.sendStatus(httpStatus.BAD_REQUEST);
  }
}
