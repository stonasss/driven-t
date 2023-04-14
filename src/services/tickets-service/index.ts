import { notFoundError } from "@/errors";
import { ticketsRepository } from "@/repositories/tickets-repository";

async function getTicketTypesByUserId(id: number){
    const ticketTypes = await ticketsRepository.findTicketTypes(id);

    if (!ticketTypes) throw notFoundError();
    return ticketTypes;
}

export const ticketsService = {
    getTicketTypesByUserId,
};