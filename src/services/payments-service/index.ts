import { notFoundError } from '@/errors';
import { paymentsRepository } from '@/repositories/payments-repository';

async function getInfoById(ticketId: number) {
  const paymentInfo = await paymentsRepository.findPaymentInfo(ticketId);

  if (!paymentInfo) throw notFoundError();
  return paymentInfo;
}

export const paymentsService = {
  getInfoById,
};
