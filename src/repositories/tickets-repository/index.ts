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

async function findTicketsById(ticketId: number) {
  return prisma.ticket.findFirst({
    where: {
      id: ticketId,
    },
    include: {
      Enrollment: {
        select: {
          userId: true,
        },
      },
      TicketType: {
        select: {
          price: true,
        },
      },
    },
  });
}

export const ticketsRepository = {
  findTicketTypes,
  findTickets,
  findTicketsById,
  findUserById,
  createTicket,
};
