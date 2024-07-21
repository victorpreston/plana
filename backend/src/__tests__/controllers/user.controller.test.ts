import request from 'supertest';
import express, { Application } from 'express';
import bodyParser from 'body-parser';
import { register, login, getUser, updateRole, getUsers, removeUser } from '../../controllers/user.controllers';
import prisma from '../../config/database.config';
import bcrypt from 'bcrypt';
import { sendWelcomeEmail } from '../../bg-services/mails/welcome';
import { generateToken } from '../../config/jwt.config';
import { Role } from '../../interfaces/user.interfaces';

// Create an Express app for testing
const app: Application = express();
app.use(bodyParser.json());
app.post('/register', register);
app.post('/login', login);
app.get('/user/:id', getUser);
app.put('/user/:id/role', updateRole);
app.get('/users', getUsers);
app.delete('/user/:id', removeUser);

// Mock Prisma client
jest.mock('../../config/database.config', () => {
  return {
    user: {
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    profile: {
      findUnique: jest.fn(),
      update: jest.fn(),
    }
  };
});
jest.mock('bcrypt');
jest.mock('../../bg-services/mails/welcome');
jest.mock('../../config/jwt.config');

describe('User Controllers', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should register a new user', async () => {
      const mockUser = {
        id: 'user-1',
        email: 'test@example.com',
        role: Role.ATTENDEE,
        profile: {
          firstName: 'John',
          lastName: 'Doe',
          phone: '1234567890',
        },
        createdAt: new Date(),
        updatedAt: new Date(),
        isDeleted: false,
      };

      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');
      (prisma.user.create as jest.Mock).mockResolvedValue(mockUser);
      (sendWelcomeEmail as jest.Mock).mockImplementation(() => Promise.resolve());

      const response = await request(app)
        .post('/register')
        .send({
          email: 'test@example.com',
          password: 'password123',
          firstName: 'John',
          lastName: 'Doe',
          phone: '1234567890',
          role: Role.ATTENDEE,
        });

      expect(response.status).toBe(201);
      expect(response.body).toEqual({
        ...mockUser,
        createdAt: mockUser.createdAt.toISOString(),
        updatedAt: mockUser.updatedAt.toISOString()
      });
    });
  });

  describe('login', () => {
    it('should login a user', async () => {
      const mockUser = {
        id: 'user-1',
        email: 'test@example.com',
        password: await bcrypt.hash('password123', 10),
        role: Role.ATTENDEE,
        profile: {
          firstName: 'John',
          lastName: 'Doe',
          phone: '1234567890',
        },
        createdAt: new Date(),
        updatedAt: new Date(),
        isDeleted: false,
      };

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (generateToken as jest.Mock).mockReturnValue('token');

      const response = await request(app)
        .post('/login')
        .send({
          email: 'test@example.com',
          password: 'password123',
        });

      expect(response.status).toBe(200);
      expect(response.body.user).toEqual({
        ...mockUser,
        createdAt: mockUser.createdAt.toISOString(),
        updatedAt: mockUser.updatedAt.toISOString()
      });
      expect(response.body.token).toBeDefined();
    });
  });

  describe('getUser', () => {
    it('should get a user by ID', async () => {
      const mockUser = {
        id: 'user-1',
        email: 'test@example.com',
        role: Role.ATTENDEE,
        profile: {
          firstName: 'John',
          lastName: 'Doe',
          phone: '1234567890',
        },
        createdAt: new Date(),
        updatedAt: new Date(),
        isDeleted: false,
      };

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

      const response = await request(app).get('/user/user-1');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        ...mockUser,
        createdAt: mockUser.createdAt.toISOString(),
        updatedAt: mockUser.updatedAt.toISOString()
      });
    });

    it('should return 404 if user not found', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      const response = await request(app).get('/user/user-1');

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('User not found');
    });
  });

  describe('updateRole', () => {
    it('should update a user role', async () => {
      const mockUser = {
        id: 'user-1',
        email: 'test@example.com',
        role: Role.MANAGER,
        profile: {
          firstName: 'John',
          lastName: 'Doe',
          phone: '1234567890',
        },
        createdAt: new Date(),
        updatedAt: new Date(),
        isDeleted: false,
      };

      (prisma.user.update as jest.Mock).mockResolvedValue(mockUser);

      const response = await request(app)
        .put('/user/user-1/role')
        .send({
          role: Role.MANAGER,
        });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        ...mockUser,
        createdAt: mockUser.createdAt.toISOString(),
        updatedAt: mockUser.updatedAt.toISOString()
      });
    });

    it('should return 400 for invalid role', async () => {
      const response = await request(app)
        .put('/user/user-1/role')
        .send({
          role: 'INVALID_ROLE',
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Invalid role');
    });
  });

  describe('getUsers', () => {
    it('should get all users', async () => {
      const mockUsers = [
        {
          id: 'user-1',
          email: 'test@example.com',
          role: Role.ATTENDEE,
          profile: {
            firstName: 'John',
            lastName: 'Doe',
            phone: '1234567890',
          },
          createdAt: new Date(),
          updatedAt: new Date(),
          isDeleted: false,
        },
      ];

      (prisma.user.findMany as jest.Mock).mockResolvedValue(mockUsers);

      const response = await request(app).get('/users');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(
        mockUsers.map(user => ({
          ...user,
          createdAt: user.createdAt.toISOString(),
          updatedAt: user.updatedAt.toISOString()
        }))
      );
    });
  });

  describe('removeUser', () => {
    it('should delete a user (soft delete)', async () => {
      (prisma.user.update as jest.Mock).mockResolvedValue({});

      const response = await request(app).delete('/user/user-1');

      expect(response.status).toBe(204);
    });
  });
});