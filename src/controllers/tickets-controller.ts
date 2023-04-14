import { AuthenticatedRequest } from "@/middlewares";
import { Response } from "express";
import { ticketsService } from "@/services/tickets-service";
import httpStatus from "http-status";

export async function getTicketsTypes(req: AuthenticatedRequest, res: Response){
    const { userId } = req;

    try {
        const ticketsTypes = await ticketsService.getTicketTypesByUserId(userId);

        return res.status(httpStatus.OK).send(ticketsTypes);
    } catch (err) {
        return res.sendStatus(httpStatus.UNAUTHORIZED);
    }
}

export async function getTickets(req: AuthenticatedRequest, res: Response){
    const { userId } = req;

    try { 
        const tickets = await ticketsService.getTicketsByUserId(userId);

        return res.status(httpStatus.OK).send(tickets);
    } catch (err) {
        return res.sendStatus(httpStatus.UNAUTHORIZED);
    }
}