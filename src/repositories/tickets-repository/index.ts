import { prisma } from "@/config";

async function findTicketTypes(id: number){
    return prisma.ticketType.findMany({
        where: { id },
    })
}

async function findTickets(id: number){
    return prisma.ticket.findMany({
        where: { id },
    })
}

export const ticketsRepository = {
    findTicketTypes,
    findTickets
}