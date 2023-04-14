import { prisma } from "@/config";

async function findTicketTypes(id: number){
    return prisma.ticketType.findMany({
        where: { id }
    })
}

export const ticketsRepository = {
    findTicketTypes,
}