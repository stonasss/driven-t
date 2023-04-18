import { prisma } from '@/config';

async function findPaymentInfo(ticketId: number) {
  return prisma.payment.findFirst({
    where: {
      ticketId,
    },
  });
}

export const paymentsRepository = {
  findPaymentInfo,
};
