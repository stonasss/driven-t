import { Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import { hotelsService } from '@/services';

export async function getHotels(req: AuthenticatedRequest, res: Response) {
  try {
    const hotels = await hotelsService.getHotels();

    return res.status(httpStatus.OK).send(hotels);
  } catch (err) {
    return res.sendStatus(httpStatus.BAD_REQUEST);
  }
}

export async function getRoomsByHotelId(req: AuthenticatedRequest, res: Response) {
  try {
    const { hotelId } = req.params;
    const roomId = Number(hotelId);

    const rooms = await hotelsService.getRooms(roomId);
    return res.status(httpStatus.OK).send(rooms);
  } catch (err) {
    return res.sendStatus(httpStatus.BAD_REQUEST);
  }
}
