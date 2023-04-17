import { Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import { ticketsService } from '@/services/tickets-service';

export async function getTicketsTypes(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;

  try {
    const ticketsTypes = await ticketsService.getTicketTypesByUserId(userId);

    return res.status(httpStatus.OK).send(ticketsTypes);
  } catch (err) {
    return res.sendStatus(httpStatus.UNAUTHORIZED);
  }
}

export async function getTickets(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;

  try {
    const tickets = await ticketsService.getTicketsByUserId(userId);

    return res.status(httpStatus.OK).send(tickets);
  } catch (err) {
    return res.sendStatus(httpStatus.UNAUTHORIZED);
  }
}
