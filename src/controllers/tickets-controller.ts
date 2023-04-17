import { Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import { ticketsService } from '@/services/tickets-service';

export async function getTicketsTypes(req: AuthenticatedRequest, res: Response) {
  try {
    const ticketsTypes = await ticketsService.getTicketTypes();

    return res.status(httpStatus.OK).send(ticketsTypes);
  } catch (err) {
    return res.sendStatus(httpStatus.BAD_REQUEST);
  }
}

export async function getTickets(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;

  try {
    const tickets = await ticketsService.getTicketsByUserId(userId);

    return res.status(httpStatus.OK).send(tickets);
  } catch (err) {
    return res.sendStatus(httpStatus.NOT_FOUND);
  }
}

export async function createTicket(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const { ticketTypeId } = req.body;

  try {
    const ticket = await ticketsService.createTicket(userId, ticketTypeId);

    if (!ticketTypeId) return res.sendStatus(httpStatus.BAD_REQUEST);
    return res.status(httpStatus.CREATED).send(ticket);
  } catch (err) {
    if (err.name === 'NotFoundError') return res.sendStatus(httpStatus.NOT_FOUND);
    return res.sendStatus(httpStatus.BAD_REQUEST);
  }
}
