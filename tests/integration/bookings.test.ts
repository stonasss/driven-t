import faker from '@faker-js/faker';
import httpStatus from 'http-status';
import * as jwt from 'jsonwebtoken';
import supertest from 'supertest';
import { TicketStatus } from '@prisma/client';
import { cleanDb, generateValidToken } from '../helpers';
import {
  createUser,
  createBooking,
  createHotel,
  createHotelRooms,
  createEnrollmentWithAddress,
  createRemoteTicketType,
  createTicket,
  createNoHotelTicketType,
  createTicketType,
  createPayment,
  createFullRoom,
  createValidTicketType,
} from '../factories';
import app, { init } from '@/app';

beforeAll(async () => {
  await init();
});

beforeEach(async () => {
  await cleanDb();
});

const server = supertest(app);

describe('GET /booking', () => {
  it('should respond with status 401 if lacking token', async () => {
    const response = await server.get('/booking');

    expect(response.status).toEqual(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if token is invalid', async () => {
    const token = faker.lorem.word();
    const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);

    expect(response.status).toEqual(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if token lacks session', async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);
    const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);

    expect(response.status).toEqual(httpStatus.UNAUTHORIZED);
  });

  describe('when token is valid', () => {
    it(`should respond with status 404 if there aren't any bookings`, async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });

    it('should respond with status 200 and correct data if booking exists', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const hotel = await createHotel();
      const room = await createHotelRooms(hotel.id);
      const booking = await createBooking(user.id, room.id);
      const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.OK);
      expect(response.body).toEqual({
        id: booking.id,
        Room: {
          id: room.id,
          name: room.name,
          capacity: room.capacity,
          hotelId: room.hotelId,
          createdAt: room.createdAt.toISOString(),
          updatedAt: room.updatedAt.toISOString(),
        },
      });
    });
  });
});

describe('POST /booking', () => {
  it('should respond with status 401 if no token is given', async () => {
    const response = await server.post('/booking');

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if given token is not valid', async () => {
    const token = faker.lorem.word();
    const response = await server.post('/booking').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if there is no session for given token', async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);
    const response = await server.post('/booking').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe('when token is valid', () => {
    it('should respond with 404 if room is not found', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);

      const response = await server
        .post('/booking')
        .set('Authorization', `Bearer ${token}`)
        .send({ roomId: Number(faker.random.numeric()) });

      expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });

    it('should respond with status 403 if ticket is remote', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const hotel = await createHotel();
      const room = await createHotelRooms(hotel.id);
      const ticketType = await createRemoteTicketType();

      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      const response = await server.post('/booking').set('Authorization', `Bearer ${token}`).send({ roomId: room.id });

      expect(response.status).toEqual(httpStatus.FORBIDDEN);
    });

    it('should respond with status 403 if ticket lacks hotel', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const hotel = await createHotel();
      const room = await createHotelRooms(hotel.id);
      const ticketType = await createNoHotelTicketType();

      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      const response = await server.post('/booking').set('Authorization', `Bearer ${token}`).send({ roomId: room.id });

      expect(response.status).toEqual(httpStatus.FORBIDDEN);
    });

    it('should respond with status 403 if ticket is not paid', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const hotel = await createHotel();
      const room = await createHotelRooms(hotel.id);
      const ticketType = await createTicketType();

      await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);
      const response = await server.post('/booking').set('Authorization', `Bearer ${token}`).send({ roomId: room.id });

      expect(response.status).toEqual(httpStatus.FORBIDDEN);
    });

    it('should respond with status 403 if room is at full capacity', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);

      const hotel = await createHotel();
      const room = await createFullRoom(hotel.id);
      const ticketType = await createTicketType();

      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

      await createPayment(ticket.id, ticketType.price);
      await createBooking(user.id, room.id);

      const response = await server.post('/booking').set('Authorization', `Bearer ${token}`).send({ roomId: room.id });

      expect(response.status).toEqual(httpStatus.FORBIDDEN);
    });

    it('should respond with status 403 when room number is 0', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createValidTicketType();
      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

      const response = await server.post('/booking').set('Authorization', `Bearer ${token}`).send({ roomId: 0 });

      expect(response.status).toEqual(httpStatus.FORBIDDEN);
    });

    it('should respond with status 403 when room number is negative', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createValidTicketType();
      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

      const response = await server.post('/booking').set('Authorization', `Bearer ${token}`).send({ roomId: -1 });

      expect(response.status).toEqual(httpStatus.FORBIDDEN);
    });

    it('should respond with status 200 and correct body', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const hotel = await createHotel();
      const room = await createHotelRooms(hotel.id);
      const ticketType = await createValidTicketType();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      await createPayment(ticket.id, ticketType.price);

      const response = await server.post('/booking').set('Authorization', `Bearer ${token}`).send({ roomId: room.id });
      expect(response.status).toBe(httpStatus.OK);
      expect(response.body).toEqual({
        bookingId: expect.any(Number),
      });
    });
  });
});

describe('PUT /booking/:bookingId', () => {
  it('should respond with status 401 if no token is given', async () => {
    const response = await server.post('/booking');

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if given token is not valid', async () => {
    const token = faker.lorem.word();
    const response = await server.post('/booking').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if there is no session for given token', async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);
    const response = await server.post('/booking').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe('when token is valid', () => {
    it('should respond with 404 if room is not found', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);

      const response = await server
        .put(`/booking/${Number(faker.random.numeric())}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ roomId: Number(faker.random.numeric()) });

      expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });

    it('should respond with 403 if there is no booking', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createValidTicketType();
      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

      const hotel = await createHotel();
      const room = await createFullRoom(hotel.id);
      const response = await server
        .put(`/booking/${faker.random.numeric()}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ roomId: room.id });

      expect(response.status).toEqual(httpStatus.FORBIDDEN);
    });

    it(`should respond with 403 if booking is not in user's name`, async () => {
      const user = await createUser();
      const otherUser = await createUser();
      const token = await generateValidToken(user);
      await generateValidToken(otherUser);

      const hotel = await createHotel();
      const room = await createFullRoom(hotel.id);
      const booking = await createBooking(otherUser.id, room.id);
      const response = await server
        .put(`/booking/${booking.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ roomId: room.id });

      expect(response.status).toEqual(httpStatus.FORBIDDEN);
    });

    it('should respond with 200 and correct body', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const hotel = await createHotel();
      const room = await createHotelRooms(hotel.id);
      const newRoom = await createHotelRooms(hotel.id);
      const booking = await createBooking(user.id, room.id);
      const response = await server
        .put(`/booking/${booking.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ roomId: newRoom.id });

      expect(response.status).toBe(httpStatus.OK);
      expect(response.body).toEqual({
        bookingId: booking.id,
      });
    });
  });
});
