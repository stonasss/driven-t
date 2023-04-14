import { notFoundError } from "@/errors";
import { ticketsRepository } from "@/repositories/tickets-repository";

async function getTicketTypesByUserId(id: number){
    const ticketTypes = await ticketsRepository.findTicketTypes(id);

    if (!ticketTypes) throw notFoundError();
    return ticketTypes;
}

async function getTicketsByUserId(id: number){
    const tickets = await ticketsRepository.findTickets(id);

    if (!tickets) throw notFoundError();
    return tickets;
}

export const ticketsService = {
    getTicketTypesByUserId,
    getTicketsByUserId,
};