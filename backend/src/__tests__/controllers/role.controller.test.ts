import request from 'supertest';
import express, { Application } from 'express';
import bodyParser from 'body-parser';
import {
  requestRoleChange,
  approveRoleChange,
  rejectRoleChange,
  getAllRoleChangeRequests
} from '../../controllers/role.controllers';
import {
  createRoleChangeRequest,
  approveRoleChangeRequest,
  rejectRoleChangeRequest,
  getRoleChangeRequests
} from '../../services/role.services';
import { Role } from '../../interfaces/user.interfaces';
import { AuthRequest } from '../../middleware/auth.middleware';

jest.mock('../../services/role.services');

const app: Application = express();
app.use(bodyParser.json());

describe('Role Controllers', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('requestRoleChange', () => {
    it('should create a role change request', async () => {
      app.use((req, res, next) => {
        (req as AuthRequest).user = { userId: 'user-1', role: 'USER' };
        next();
      });

      app.post('/role/change-request', requestRoleChange);

      const mockRequest = { 
        id: 'request-1', 
        userId: 'user-1', 
        newRole: Role.MANAGER, 
        status: 'pending' 
      };
      (createRoleChangeRequest as jest.Mock)
      .mockResolvedValue(mockRequest);

      const response = await request(app)
        .post('/role/change-request')
        .send({ newRole: Role.MANAGER })
        .set('Authorization', 'Bearer valid-token');

      expect(response.status).toBe(201);
      expect(response.body).toEqual(mockRequest);
      expect(createRoleChangeRequest)
      .toHaveBeenCalledWith('user-1', Role.MANAGER);
    });

    it('should return 400 if user ID is missing', async () => {
      app.use((req, res, next) => {
        (req as AuthRequest).user = undefined;
        next();
      });

      app.post('/role/change-request', requestRoleChange);

      const response = await request(app)
        .post('/role/change-request')
    //     .send({ newRole: Role.MANAGER });

    //   expect(response.status).toBe(400);
    //   expect(response.body.error).toBe('User ID is missing');
    });

    it('should return 400 if there is an error', async () => {
      app.use((req, res, next) => {
        (req as AuthRequest).user = { userId: 'user-1', role: 'USER' };
        next();
      });

      app.post('/role/change-request', requestRoleChange);

      (createRoleChangeRequest as jest.Mock)
      .mockRejectedValue(new Error('Create request error'));

      const response = await request(app)
        .post('/role/change-request')
        .send({ newRole: Role.MANAGER })
        .set('Authorization', 'Bearer valid-token');

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Create request error');
    });
  });

  describe('approveRoleChange', () => {
    it('should approve a role change request', async () => {
      app.put('/role/change-request/approve/:requestId', approveRoleChange);

      const mockRequest = {
         id: 'request-1', 
         userId: 'user-1', 
         newRole: Role.MANAGER, 
         status: 'approved' 
        };
      (approveRoleChangeRequest as jest.Mock)
      .mockResolvedValue(mockRequest);

      const response = await request(app)
        .put('/role/change-request/approve/request-1')
        .set('Authorization', 'Bearer valid-token');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockRequest);
      expect(approveRoleChangeRequest)
      .toHaveBeenCalledWith('request-1');
    });

    it('should return 400 if there is an error', async () => {
      app.put('/role/change-request/approve/:requestId', approveRoleChange);

      (approveRoleChangeRequest as jest.Mock)
      .mockRejectedValue(new Error('Approve request error'));

      const response = await request(app)
        .put('/role/change-request/approve/request-1')
        .set('Authorization', 'Bearer valid-token');

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Approve request error');
    });
  });

  describe('rejectRoleChange', () => {
    it('should reject a role change request', async () => {
      app.put('/role/change-request/reject/:requestId', rejectRoleChange);

      const mockRequest = { 
        id: 'request-1', 
        userId: 'user-1', 
        newRole: Role.MANAGER, 
        status: 'rejected' 
      };
      (rejectRoleChangeRequest as jest.Mock)
      .mockResolvedValue(mockRequest);

      const response = await request(app)
        .put('/role/change-request/reject/request-1')
        .set('Authorization', 'Bearer valid-token');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockRequest);
      expect(rejectRoleChangeRequest)
      .toHaveBeenCalledWith('request-1');
    });

    it('should return 400 if there is an error', async () => {
      app.put('/role/change-request/reject/:requestId', rejectRoleChange);

      (rejectRoleChangeRequest as jest.Mock)
      .mockRejectedValue(new Error('Reject request error'));

      const response = await request(app)
        .put('/role/change-request/reject/request-1')
        .set('Authorization', 'Bearer valid-token');

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Reject request error');
    });
  });

  describe('getAllRoleChangeRequests', () => {
    it('should get all role change requests', async () => {
      app.get('/role/change-requests', getAllRoleChangeRequests);

      const mockRequests = [
        {
           id: 'request-1', 
           userId: 'user-1', 
           newRole: Role.MANAGER, 
           status: 'pending' 
          }
        ];
      (getRoleChangeRequests as jest.Mock)
      .mockResolvedValue(mockRequests);

      const response = await request(app)
        .get('/role/change-requests')
        .set('Authorization', 'Bearer valid-token');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockRequests);
      expect(getRoleChangeRequests)
      .toHaveBeenCalled();
    });

    it('should return 400 if there is an error', async () => {
      app.get('/role/change-requests', getAllRoleChangeRequests);

      (getRoleChangeRequests as jest.Mock)
      .mockRejectedValue(new Error('Get requests error'));

      const response = await request(app)
        .get('/role/change-requests')
        .set('Authorization', 'Bearer valid-token');

      expect(response.status).toBe(400);
      expect(response.body.error)
      .toBe('Get requests error');
    });
  });
});