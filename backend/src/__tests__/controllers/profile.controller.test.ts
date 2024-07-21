import request from 'supertest';
import express, { Application } from 'express';
import bodyParser from 'body-parser';
import {
  requestPasswordReset,
  resetPassword,
  getProfile,
  editProfile,
  changePassword
} from '../../controllers/profile.controllers';
import {
  requestPasswordReset as requestPasswordResetService,
  resetPassword as resetPasswordService,
  getProfileByUserId,
  updateProfile,
  updatePassword
} from '../../services/profile.services';

jest.mock('../../services/profile.services');

const app: Application = express();
app.use(bodyParser.json());

app.post('/profile/request-password-reset', requestPasswordReset);
app.post('/profile/reset-password', resetPassword);
app.get('/profile/:userId', getProfile);
app.put('/profile/:userId', editProfile);
app.put('/profile/:userId/password', changePassword);

describe('Profile Controllers', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('requestPasswordReset', () => {
    it('should request a password reset', async () => {
      (requestPasswordResetService as jest.Mock).mockResolvedValue(undefined);

      const response = await request(app)
        .post('/profile/request-password-reset')
        .send({ email: 'test@example.com' });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Password reset code sent to email');
      expect(requestPasswordResetService).toHaveBeenCalledWith('test@example.com');
    });

    it('should return 400 if there is an error', async () => {
      (requestPasswordResetService as jest.Mock).mockRejectedValue(new Error('Request error'));

      const response = await request(app)
        .post('/profile/request-password-reset')
        .send({ email: 'test@example.com' });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Request error');
    });
  });

  describe('resetPassword', () => {
    it('should reset the password', async () => {
      (resetPasswordService as jest.Mock).mockResolvedValue(undefined);

      const response = await request(app)
        .post('/profile/reset-password')
        .send({ email: 'test@example.com', resetCode: '123456', newPassword: 'newPassword' });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Password reset successfully');
      expect(resetPasswordService).toHaveBeenCalledWith('test@example.com', '123456', 'newPassword');
    });

    it('should return 400 if there is an error', async () => {
      (resetPasswordService as jest.Mock).mockRejectedValue(new Error('Reset error'));

      const response = await request(app)
        .post('/profile/reset-password')
        .send({ email: 'test@example.com', resetCode: '123456', newPassword: 'newPassword' });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Reset error');
    });
  });

  describe('getProfile', () => {
    it('should get the profile by user ID', async () => {
      const mockProfile = { userId: 'user-1', firstName: 'John', lastName: 'Doe' };
      (getProfileByUserId as jest.Mock).mockResolvedValue(mockProfile);

      const response = await request(app)
        .get('/profile/user-1');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockProfile);
      expect(getProfileByUserId).toHaveBeenCalledWith('user-1');
    });

    it('should return 404 if profile is not found', async () => {
      (getProfileByUserId as jest.Mock).mockResolvedValue(null);

      const response = await request(app)
        .get('/profile/user-1');

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Profile not found');
    });

    it('should return 400 if there is an error', async () => {
      (getProfileByUserId as jest.Mock).mockRejectedValue(new Error('Get profile error'));

      const response = await request(app)
        .get('/profile/user-1');

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Get profile error');
    });
  });

  describe('editProfile', () => {
    it('should update the profile', async () => {
      const mockProfile = { userId: 'user-1', firstName: 'John', lastName: 'Doe' };
      (updateProfile as jest.Mock).mockResolvedValue(mockProfile);

      const response = await request(app)
        .put('/profile/user-1')
        .send({ firstName: 'John', lastName: 'Doe', email: 'test@example.com' });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockProfile);
      expect(updateProfile).toHaveBeenCalledWith('user-1', { firstName: 'John', lastName: 'Doe' }, 'test@example.com');
    });

    it('should return 400 if there is an error', async () => {
      (updateProfile as jest.Mock).mockRejectedValue(new Error('Update error'));

      const response = await request(app)
        .put('/profile/user-1')
        .send({ firstName: 'John', lastName: 'Doe', email: 'test@example.com' });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Update error');
    });
  });

  describe('changePassword', () => {
    it('should update the password', async () => {
      (updatePassword as jest.Mock).mockResolvedValue(undefined);

      const response = await request(app)
        .put('/profile/user-1/password')
        .send({ newPassword: 'newPassword' });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Password updated successfully');
      expect(updatePassword).toHaveBeenCalledWith('user-1', 'newPassword');
    });

    it('should return 400 if there is an error', async () => {
      (updatePassword as jest.Mock).mockRejectedValue(new Error('Password update error'));

      const response = await request(app)
        .put('/profile/user-1/password')
        .send({ newPassword: 'newPassword' });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Password update error');
    });
  });
});