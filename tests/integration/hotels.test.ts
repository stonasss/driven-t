import httpStatus from 'http-status';
import faker from '@faker-js/faker';
import supertest from 'supertest';
import * as jwt from 'jsonwebtoken';
import { TicketStatus } from '@prisma/client';
import { generateValidToken, cleanDb } from '../helpers';
import { createTicket, createTicketType, createEnrollmentWithAddress, createUser } from '../factories';
import app, { init } from '@/app';

const server = supertest(app);

beforeAll(async () => {
  await init();
});

beforeEach(async () => {
  await cleanDb();
});

describe('GET /hotels', () => {
  it(`should respond with status 401 if token isn't given`, async () => {
    const response = await server.get('/hotels');

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if token is invalid', async () => {
    const token = faker.lorem.word();
    const response = await server.get('hotels').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if valid token has no session', async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);
    const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 404 if ticket does not exist', async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    await createEnrollmentWithAddress(user);
    const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.NOT_FOUND);
  });

  it('should respond with status 402 when ticket is not paid', async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    const enrollment = await createEnrollmentWithAddress(user);
    const ticketType = await createTicketType();

    await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);
    const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.PAYMENT_REQUIRED);
  });
});
