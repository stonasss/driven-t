import { prisma } from '@/config';

async function findTicketTypes() {
  return prisma.ticketType.findMany();
}

async function findTickets(userId: number) {
  return prisma.ticket.findFirst({
    where: {
      Enrollment: {
        userId,
      },
    },
    include: {
      TicketType: true,
    },
  });
}

async function createTicket(userId: number, ticketTypeId: number) {
  return prisma.ticket.create({
    data: {
      ticketTypeId: ticketTypeId,
      enrollmentId: userId,
      status: 'RESERVED',
    },
    include: {
      TicketType: true,
    },
  });
}

async function findUserById(userId: number) {
  const user = prisma.enrollment.findFirst({
    where: {
      userId,
    },
  });
  return user;
}

export const ticketsRepository = {
  findTicketTypes,
  findTickets,
  findUserById,
  createTicket,
};
