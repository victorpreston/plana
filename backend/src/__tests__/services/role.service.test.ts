import {
  createRoleChangeRequest,
  approveRoleChangeRequest,
  rejectRoleChangeRequest,
  getRoleChangeRequests,
} from '../../services/role.services';
import { RoleChangeRequest, RequestStatus } from '../../interfaces/role.interfaces';
import { Role } from '../../interfaces/user.interfaces';
import {
  sendRoleChangeRequestEmail,
  sendRoleChangeApprovalEmail,
  sendRoleChangeRejectionEmail,
} from '../../bg-services/mails/role-change';

jest.mock('../../config/database.config', () => ({
  __esModule: true,
  default: {
    roleChangeRequest: {
      create: jest.fn(),
      update: jest.fn(),
      findMany: jest.fn(),
    },
    user: {
      update: jest.fn(),
    },
  },
}));

jest.mock('../../bg-services/mails/role-change', () => ({
  sendRoleChangeRequestEmail: jest.fn().mockResolvedValue(undefined),
  sendRoleChangeApprovalEmail: jest.fn().mockResolvedValue(undefined),
  sendRoleChangeRejectionEmail: jest.fn().mockResolvedValue(undefined),
}));

const prisma = require('../../config/database.config').default;

// Mock data
const mockUser = {
  id: 'user-1',
  email: 'test@example.com',
  role: Role.ATTENDEE,
  createdAt: new Date(),
  updatedAt: new Date(),
  isDeleted: false,
};

const mockRequest: RoleChangeRequest = {
  id: '1',
  userId: 'user-1',
  newRole: Role.MANAGER,
  status: RequestStatus.PENDING,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockRequestWithUser = {
  ...mockRequest,
  user: mockUser,
};

describe('Role Services', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createRoleChangeRequest', () => {
    it('should create a role change request', async () => {
      (prisma.roleChangeRequest.create as jest.Mock).mockResolvedValue(mockRequest);

      const result = await createRoleChangeRequest('user-1', Role.MANAGER);

      expect(result).toEqual(mockRequest);
      expect(prisma.roleChangeRequest.create).toHaveBeenCalledWith({
        data: {
          userId: 'user-1',
          newRole: Role.MANAGER,
          status: RequestStatus.PENDING,
        },
      });
      expect(sendRoleChangeRequestEmail).toHaveBeenCalledWith('user-1');
    });

    it('should throw an error if userId is not provided', async () => {
      await expect(createRoleChangeRequest('', Role.MANAGER)).rejects.toThrow('User ID is required');
    });
  });

  describe('approveRoleChangeRequest', () => {
    it('should approve a role change request', async () => {
      const approvedRequest = { ...mockRequest, status: RequestStatus.APPROVED };

      (prisma.roleChangeRequest.update as jest.Mock).mockResolvedValue(mockRequestWithUser);
      (prisma.user.update as jest.Mock).mockResolvedValue(mockUser);

      const result = await approveRoleChangeRequest('1');

      expect(result).toEqual(mockRequestWithUser);
      expect(prisma.roleChangeRequest.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: { status: RequestStatus.APPROVED },
        include: { user: true },
      });
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: 'user-1' },
        data: { role: Role.MANAGER },
      });
      expect(sendRoleChangeApprovalEmail).toHaveBeenCalledWith('user-1');
    });

    it('should throw an error if user is not found', async () => {
      (prisma.roleChangeRequest.update as jest.Mock).mockResolvedValue({
        ...mockRequest,
        user: null,
      });

      await expect(approveRoleChangeRequest('1')).rejects.toThrow('User not found');
    });
  });

  describe('rejectRoleChangeRequest', () => {
    it('should reject a role change request', async () => {
      const rejectedRequest = { ...mockRequest, status: RequestStatus.REJECTED };

      (prisma.roleChangeRequest.update as jest.Mock).mockResolvedValue(mockRequestWithUser);

      const result = await rejectRoleChangeRequest('1');

      expect(result).toEqual(mockRequestWithUser);
      expect(prisma.roleChangeRequest.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: { status: RequestStatus.REJECTED },
        include: { user: true },
      });
      expect(sendRoleChangeRejectionEmail).toHaveBeenCalledWith('user-1');
    });

    it('should throw an error if user is not found', async () => {
      (prisma.roleChangeRequest.update as jest.Mock).mockResolvedValue({
        ...mockRequest,
        user: null,
      });

      await expect(rejectRoleChangeRequest('1')).rejects.toThrow('User not found');
    });
  });

  describe('getRoleChangeRequests', () => {
    it('should fetch all role change requests', async () => {
      const mockRequests: RoleChangeRequest[] = [mockRequestWithUser];

      (prisma.roleChangeRequest.findMany as jest.Mock).mockResolvedValue(mockRequests);

      const result = await getRoleChangeRequests();

      expect(result).toEqual(mockRequests);
      expect(prisma.roleChangeRequest.findMany).toHaveBeenCalledWith({
        include: { user: true },
      });
    });
  });
});