import { notFoundError, unauthorizedError } from '@/errors';
import { paymentsRepository } from '@/repositories/payments-repository';
import { ticketsRepository } from '@/repositories/tickets-repository';

async function getInfoById(ticketId: number) {
  const paymentInfo = await paymentsRepository.findPaymentInfo(ticketId);

  if (!paymentInfo) throw notFoundError();
  return paymentInfo;
}

type CardStructure = {
  issuer: string;
  number: number;
  name: string;
  expirationDate: Date;
  cvv: number;
};

type PaymentStructure = {
  value: number;
  cardIssuer: string;
  cardLastDigits: string;
};

async function createTransaction(userId: number, ticketId: number, cardData: CardStructure) {
  const ticket = await ticketsRepository.findTicketsById(ticketId);

  if (!ticket) throw notFoundError();
  if (ticket.Enrollment.userId !== userId) throw unauthorizedError();

  const fourDigits = cardData.number.toString().slice(-4);

  const paymentInfo: PaymentStructure = {
    value: ticket.TicketType.price,
    cardIssuer: cardData.issuer,
    cardLastDigits: fourDigits,
  };

  const transaction = await paymentsRepository.createTransaction(ticketId, paymentInfo);

  return transaction;
}

export const paymentsService = {
  getInfoById,
  createTransaction,
};
