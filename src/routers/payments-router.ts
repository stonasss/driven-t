import { Router } from 'express';
import { authenticateToken } from '@/middlewares';

import { getPaymentInfo } from '@/controllers';

const paymentsRouter = Router();

paymentsRouter.all('/*', authenticateToken).get('/', getPaymentInfo);

export { paymentsRouter };
