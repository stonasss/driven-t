import { Router } from 'express';
import { authenticateToken } from '@/middlewares';
import { getBookings, createBooking } from '@/controllers/bookings-controller';

const bookingsRouter = Router();

bookingsRouter.all('/*', authenticateToken).get('/', getBookings).post('/', createBooking);

export { bookingsRouter };
