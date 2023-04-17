import { Router } from 'express';
import { authenticateToken } from '@/middlewares';

import { getTicketsTypes, getTickets, createTicket } from '@/controllers';

const ticketsRouter = Router();

ticketsRouter.all('/*', authenticateToken).get('/types', getTicketsTypes).get('/', getTickets).post('/', createTicket);

export { ticketsRouter };
