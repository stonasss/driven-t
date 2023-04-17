import { notFoundError } from '@/errors';
import { ticketsRepository } from '@/repositories/tickets-repository';

async function getTicketTypes() {
  const ticketTypes = await ticketsRepository.findTicketTypes();
  return ticketTypes;
}

async function getTicketsByUserId(userId: number) {
  const tickets = await ticketsRepository.findTickets(userId);

  if (!tickets) throw notFoundError();
  return tickets;
}

async function createTicket(userId: number, ticketTypeId: number) {
  const user = await ticketsRepository.findUserById(userId);
  if (!user) throw notFoundError();

  const ticket = await ticketsRepository.createTicket(user.id, ticketTypeId);
  return ticket;
}

export const ticketsService = {
  getTicketTypes,
  getTicketsByUserId,
  createTicket,
};
