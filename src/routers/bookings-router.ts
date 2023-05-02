import { Router } from 'express';
import { authenticateToken } from '@/middlewares';
import { getBookings, createBooking, alterBooking } from '@/controllers/bookings-controller';

const bookingsRouter = Router();

bookingsRouter
  .all('/*', authenticateToken)
  .get('/', getBookings)
  .post('/', createBooking)
  .put('/:bookingId', alterBooking);

export { bookingsRouter };
