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
