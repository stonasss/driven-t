import { prisma } from '@/config';

async function findPaymentInfo(ticketId: number) {
  return prisma.payment.findFirst({
    where: {
      ticketId,
    },
  });
}

type PaymentStructure = {
  value: number;
  cardIssuer: string;
  cardLastDigits: string;
};

async function registerTransaction(ticketId: number, paymentInfo: PaymentStructure) {
  return prisma.payment.create({
    data: {
      ticketId: ticketId,
      value: paymentInfo.value,
      cardIssuer: paymentInfo.cardIssuer,
      cardLastDigits: paymentInfo.cardLastDigits,
    },
  });
}

export const paymentsRepository = {
  findPaymentInfo,
  registerTransaction,
};
