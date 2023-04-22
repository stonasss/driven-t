import { Router } from 'express';
import { authenticateToken } from '@/middlewares';

import { getHotels } from '@/controllers';

const hotelsRouter = Router();

hotelsRouter.all('/*', authenticateToken).get('/hotels', getHotels).get('/:hotelId');

export { hotelsRouter };
