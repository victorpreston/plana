import prisma from '../../config/database.config';
import { 
  requestPasswordReset, 
  resetPassword, 
  updateProfile, 
  getProfileByUserId, 
  updatePassword 
} from '../../services/profile.services';
import { sendPasswordResetEmail } from '../../bg-services/mails/password-reset';
import bcrypt from 'bcrypt';
import { mapProfile } from '../../services/user.services';
import { Profile, User, Role } from '../../interfaces/user.interfaces';

jest.mock('../../config/database.config', () => {
  return {
    user: {
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
    },
    profile: {
      findUnique: jest.fn(),
      update: jest.fn(),
    }
  };
});
jest.mock('../../bg-services/mails/password-reset');
jest.mock('bcrypt', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));
jest.mock('../../services/user.services', () => ({
  mapProfile: jest.fn(),
}));

describe('Profile Services', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('requestPasswordReset', () => {
    it('should request a password reset and send an email', async () => {
      const mockUser = {
        id: 'user-1',
        email: 'test@example.com',
        password: '',
        role: Role.ATTENDEE,
        createdAt: new Date(),
        updatedAt: new Date(),
        isDeleted: false
      } as User;
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedCode');
      (sendPasswordResetEmail as jest.Mock).mockResolvedValue(undefined);

      await requestPasswordReset('test@example.com');

      expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { email: 'test@example.com' } });
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: 'user-1' },
        data: {
          passwordResetToken: 'hashedCode',
          passwordResetTokenExpiry: expect.any(Date),
        },
      });
      expect(sendPasswordResetEmail).toHaveBeenCalledWith('test@example.com', expect.any(String));
    });

    it('should throw an error if user does not exist', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(requestPasswordReset('test@example.com')).rejects.toThrow('User with this email does not exist');
    });
  });

  describe('resetPassword', () => {
    it('should reset the password if code is valid', async () => {
      const mockUser = {
        id: 'user-1',
        email: 'test@example.com',
        passwordResetToken: 'hashedCode',
        passwordResetTokenExpiry: new Date(Date.now() + 300000),
        password: '',
        role: Role.ATTENDEE,
        createdAt: new Date(),
        updatedAt: new Date(),
        isDeleted: false
      } as User;
      (prisma.user.findFirst as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (bcrypt.hash as jest.Mock).mockResolvedValue('newHashedPassword');

      await resetPassword('test@example.com', 'validCode', 'newPassword');

      expect(prisma.user.findFirst).toHaveBeenCalledWith({
        where: {
          email: 'test@example.com',
          passwordResetToken: { not: null },
          passwordResetTokenExpiry: { gte: expect.any(Date) },
        },
      });
      expect(bcrypt.compare).toHaveBeenCalledWith('validCode', 'hashedCode');
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: 'user-1' },
        data: {
          password: 'newHashedPassword',
          passwordResetToken: null,
          passwordResetTokenExpiry: null,
        },
      });
    });

    it('should throw an error if code is invalid', async () => {
      const mockUser = {
        id: 'user-1',
        email: 'test@example.com',
        passwordResetToken: 'hashedCode',
        passwordResetTokenExpiry: new Date(Date.now() + 300000),
        password: '',
        role: Role.ATTENDEE,
        createdAt: new Date(),
        updatedAt: new Date(),
        isDeleted: false
      } as User;
      (prisma.user.findFirst as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(resetPassword('test@example.com', 'invalidCode', 'newPassword'))
        .rejects.toThrow('Invalid or expired password reset code');
    });

    it('should throw an error if user or token is not found', async () => {
      (prisma.user.findFirst as jest.Mock).mockResolvedValue(null);

      await expect(resetPassword('test@example.com', 'validCode', 'newPassword')).rejects.toThrow('Invalid or expired password reset code');
    });
  });

  describe('updateProfile', () => {
    it('should update the profile and email', async () => {
      const mockUser = {
        id: 'user-1',
        email: 'test@example.com',
        password: '',
        role: Role.ATTENDEE,
        createdAt: new Date(),
        updatedAt: new Date(),
        isDeleted: false
      } as User;
      const mockProfile = { userId: 'user-1', firstName: 'John', lastName: 'Doe', phone: '1234567890' } as Profile;
      (prisma.user.update as jest.Mock).mockResolvedValue(mockUser);
      (prisma.profile.update as jest.Mock).mockResolvedValue(mockProfile);
      (mapProfile as jest.Mock).mockReturnValue(mockProfile);

      const result = await updateProfile('user-1', { firstName: 'John', lastName: 'Doe', phone: '1234567890' }, 'newemail@example.com');

      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: 'user-1' },
        data: { email: 'newemail@example.com' },
      });
      expect(prisma.profile.update).toHaveBeenCalledWith({
        where: { userId: 'user-1' },
        data: {
          firstName: 'John',
          lastName: 'Doe',
          phone: '1234567890',
        },
      });
      expect(result).toEqual(mockProfile);
    });

    it('should update the profile without email', async () => {
      const mockProfile = { userId: 'user-1', firstName: 'John', lastName: 'Doe', phone: '1234567890' } as Profile;
      (prisma.profile.update as jest.Mock).mockResolvedValue(mockProfile);
      (mapProfile as jest.Mock).mockReturnValue(mockProfile);

      const result = await updateProfile('user-1', { firstName: 'John', lastName: 'Doe', phone: '1234567890' });

      expect(prisma.user.update).not.toHaveBeenCalled();
      expect(prisma.profile.update).toHaveBeenCalledWith({
        where: { userId: 'user-1' },
        data: {
          firstName: 'John',
          lastName: 'Doe',
          phone: '1234567890',
        },
      });
      expect(result).toEqual(mockProfile);
    });
  });

  describe('getProfileByUserId', () => {
    it('should return the profile for the given userId', async () => {
      const mockProfile = { userId: 'user-1', firstName: 'John', lastName: 'Doe', phone: '1234567890' } as Profile;
      (prisma.profile.findUnique as jest.Mock).mockResolvedValue(mockProfile);
      (mapProfile as jest.Mock).mockReturnValue(mockProfile);

      const result = await getProfileByUserId('user-1');

      expect(prisma.profile.findUnique).toHaveBeenCalledWith({ where: { userId: 'user-1' } });
      expect(result).toEqual(mockProfile);
    });

    it('should return null if profile is not found', async () => {
      (prisma.profile.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await getProfileByUserId('user-1');

      expect(result).toBeNull();
    });
  });

  describe('updatePassword', () => {
    it('should update the user\'s password', async () => {
      const mockUser = {
        id: 'user-1',
        email: 'test@example.com',
        password: '',
        role: Role.ATTENDEE,
        createdAt: new Date(),
        updatedAt: new Date(),
        isDeleted: false
      } as User;
      (bcrypt.hash as jest.Mock).mockResolvedValue('newHashedPassword');
      (prisma.user.update as jest.Mock).mockResolvedValue(mockUser);

      await updatePassword('user-1', 'newPassword');

      expect(bcrypt.hash).toHaveBeenCalledWith('newPassword', 10);
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: 'user-1' },
        data: { password: 'newHashedPassword' },
      });
    });
  });
});