import { Router } from 'express';
import { authenticateToken } from '@/middlewares';
import { getPaymentInfo, createTransaction } from '@/controllers';

const paymentsRouter = Router();

paymentsRouter.all('/*', authenticateToken).get('/', getPaymentInfo).post('/process', createTransaction);

export { paymentsRouter };
