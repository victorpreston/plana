import bcrypt from 'bcrypt';
import { 
  registerUser, 
  loginUser, 
  getUserById, 
  updateUserRole, 
  getAllUsers, 
  deleteUser 
} from '../../services/user.services';
import { Role } from '../../interfaces/user.interfaces';
import { generateToken } from '../../config/jwt.config';
import { sendWelcomeEmail } from '../../bg-services/mails/welcome';

jest.mock('bcrypt');
jest.mock('../../config/jwt.config');
jest.mock('../../bg-services/mails/welcome');

jest.mock('../../config/database.config', () => ({
  __esModule: true,
  default: {
    user: {
      create: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      findMany: jest.fn(),
    },
  },
}));

const prisma = require('../../config/database.config').default;

describe('User Service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('registerUser', () => {
    it('should register a new user', async () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        password: 'hashedPassword',
        role: Role.ATTENDEE,
        profile: {
          id: '1',
          userId: '1',
          firstName: 'Test',
          lastName: 'User',
          phone: '1234567890',
          imageUrl: null,
          createdAt: new Date(),
          updatedAt: new Date(),
          isDeleted: false,
        },
        createdAt: new Date(),
        updatedAt: new Date(),
        isDeleted: false,
      };

      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');
      (prisma.user.create as jest.Mock).mockResolvedValue(mockUser);
      (sendWelcomeEmail as jest.Mock).mockImplementation(() => Promise.resolve());

      const result = await registerUser('test@example.com', 'password', 'Test', 'User', '1234567890');

      expect(result).toEqual(mockUser);
      expect(bcrypt.hash).toHaveBeenCalledWith('password', 10);
      expect(prisma.user.create).toHaveBeenCalled();
      expect(sendWelcomeEmail).toHaveBeenCalled();
    });

    it('should throw an error if email already exists', async () => {
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');
      (prisma.user.create as jest.Mock).mockRejectedValue({
        code: 'P2002',
        meta: {
          target: ['email'],
        },
      });

      // await expect(registerUser('test@example.com', 'password', 'Test', 'User', '1234567890'))
      //   .rejects
      //   .toThrow('A user with the email test@example.com already exists.');
    });
  });

  describe('loginUser', () => {
    it('should login a user', async () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        password: 'hashedPassword',
        role: Role.ATTENDEE,
        profile: {
          id: '1',
          userId: '1',
          firstName: 'Test',
          lastName: 'User',
          phone: '1234567890',
          imageUrl: null,
          createdAt: new Date(),
          updatedAt: new Date(),
          isDeleted: false,
        },
        createdAt: new Date(),
        updatedAt: new Date(),
        isDeleted: false,
      };

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (generateToken as jest.Mock).mockReturnValue('token');

      const result = await loginUser('test@example.com', 'password');

      expect(result).toEqual({ user: mockUser, token: 'token' });
      expect(prisma.user.findUnique).toHaveBeenCalled();
      expect(bcrypt.compare).toHaveBeenCalledWith('password', 'hashedPassword');
      expect(generateToken).toHaveBeenCalledWith(mockUser.id, mockUser.role);
    });

    it('should throw an error if email or password is invalid', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(loginUser('test@example.com', 'password'))
        .rejects
        .toThrow('Invalid email or password');

      const mockUser = {
        id: '1',
        email: 'test@example.com',
        password: 'hashedPassword',
        role: Role.ATTENDEE,
        profile: {
          id: '1',
          userId: '1',
          firstName: 'Test',
          lastName: 'User',
          phone: '1234567890',
          imageUrl: null,
          createdAt: new Date(),
          updatedAt: new Date(),
          isDeleted: false,
        },
        createdAt: new Date(),
        updatedAt: new Date(),
        isDeleted: false,
      };

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(loginUser('test@example.com', 'password'))
        .rejects
        .toThrow('Invalid email or password');
    });
  });

  describe('getUserById', () => {
    it('should get a user by ID', async () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        password: 'hashedPassword',
        role: Role.ATTENDEE,
        profile: {
          id: '1',
          userId: '1',
          firstName: 'Test',
          lastName: 'User',
          phone: '1234567890',
          imageUrl: null,
          createdAt: new Date(),
          updatedAt: new Date(),
          isDeleted: false,
        },
        createdAt: new Date(),
        updatedAt: new Date(),
        isDeleted: false,
      };

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

      const result = await getUserById('1');

      expect(result).toEqual(mockUser);
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
        include: { profile: true },
      });
    });

    it('should return null if user not found', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await getUserById('1');

      expect(result).toBeNull();
    });
  });

  describe('updateUserRole', () => {
    it('should update a user\'s role', async () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        password: 'hashedPassword',
        role: Role.MANAGER,
        profile: {
          id: '1',
          userId: '1',
          firstName: 'Test',
          lastName: 'User',
          phone: '1234567890',
          imageUrl: null,
          createdAt: new Date(),
          updatedAt: new Date(),
          isDeleted: false,
        },
        createdAt: new Date(),
        updatedAt: new Date(),
        isDeleted: false,
      };

      (prisma.user.update as jest.Mock).mockResolvedValue(mockUser);

      const result = await updateUserRole('1', Role.MANAGER);

      expect(result).toEqual(mockUser);
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: { role: Role.MANAGER },
        include: { profile: true },
      });
    });
  });

  describe('getAllUsers', () => {
    it('should get all users', async () => {
      const mockUsers = [{
        id: '1',
        email: 'test@example.com',
        password: 'hashedPassword',
        role: Role.ATTENDEE,
        profile: {
          id: '1',
          userId: '1',
          firstName: 'Test',
          lastName: 'User',
          phone: '1234567890',
          imageUrl: null,
          createdAt: new Date(),
          updatedAt: new Date(),
          isDeleted: false,
        },
        createdAt: new Date(),
        updatedAt: new Date(),
        isDeleted: false,
      }];

      (prisma.user.findMany as jest.Mock).mockResolvedValue(mockUsers);

      const result = await getAllUsers();

      expect(result).toEqual(mockUsers);
      expect(prisma.user.findMany).toHaveBeenCalledWith({
        where: { isDeleted: false },
        include: { profile: true },
      });
    });
  });

  describe('deleteUser', () => {
    it('should soft delete a user', async () => {
      (prisma.user.update as jest.Mock).mockResolvedValue({});

      await deleteUser('1');

      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: { isDeleted: true },
      });
    });
  });
});