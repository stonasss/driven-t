import httpStatus from 'http-status';
import supertest from 'supertest';
import * as jwt from 'jsonwebtoken';
import { generateValidToken, cleanDb } from '../helpers';
import app, { init } from '@/app';
import { prisma } from '@/config';
/* import { 
    createTicket, 
    createTicketType,
    createEnrollmentWithAddress,
    createUser,
} from '../factories'; */

const server = supertest(app);

beforeAll(async () => {
  await init();
});

beforeEach(async () => {
  await cleanDb();
});

describe('GET /hotels', () => {
  it('should respond with status 401 if invalid token', async () => {
    const response = await server.get('/hotels');

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });
});
