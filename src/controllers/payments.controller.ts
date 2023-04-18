import { Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import { paymentsService } from '@/services/payments-service';

export async function getPaymentInfo(req: AuthenticatedRequest, res: Response) {
  const ticketId = Number(req.query.ticketId);

  try {
    if (!ticketId) return res.sendStatus(httpStatus.BAD_REQUEST);

    const paymentInfo = await paymentsService.getInfoById(ticketId);
    return res.status(httpStatus.OK).send(paymentInfo);
  } catch (err) {
    return res.sendStatus(httpStatus.BAD_REQUEST);
  }
}

export async function createTransaction(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const { ticketId, cardData } = req.body;

  if (!cardData || !ticketId) return res.sendStatus(httpStatus.BAD_REQUEST);

  try {
    const transaction = await paymentsService.createTransaction(userId, ticketId, cardData);
    return res.status(httpStatus.OK).send(transaction);
  } catch (err) {
    return res.sendStatus(httpStatus.BAD_REQUEST);
  }
}
