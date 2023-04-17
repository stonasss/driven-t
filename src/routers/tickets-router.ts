import { Router } from 'express';
import { authenticateToken } from '@/middlewares';

import { getTicketsTypes, getTickets } from '@/controllers';

const ticketsRouter = Router();

ticketsRouter.get('/types', getTicketsTypes).get('/', getTickets);

export { ticketsRouter };