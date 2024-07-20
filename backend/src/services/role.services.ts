import prisma from '../config/database.config';
import { RoleChangeRequest, RequestStatus } from '../interfaces/role.interfaces';
import { Role } from '../interfaces/user.interfaces';
import { 
  sendRoleChangeRequestEmail, 
  sendRoleChangeApprovalEmail, 
  sendRoleChangeRejectionEmail 
} from '../bg-services/mails/role-change';

export const createRoleChangeRequest = async (userId: string, newRole: Role): Promise<RoleChangeRequest> => {
  if (!userId) {
    throw new Error('User ID is required');
  }

  const request = await prisma.roleChangeRequest.create({
    data: {
      userId,
      newRole,
      status: RequestStatus.PENDING,
    },
  });

  sendRoleChangeRequestEmail(userId).catch(error => {
    console.error('Failed to send role change request email:', error.message || error);
  });

  return request as RoleChangeRequest;
};

export const approveRoleChangeRequest = async (requestId: string): Promise<RoleChangeRequest> => {
  const request = await prisma.roleChangeRequest.update({
    where: { id: requestId },
    data: { status: RequestStatus.APPROVED },
    include: { user: true },
  });

  if (!request.user) {
    throw new Error('User not found');
  }

  await prisma.user.update({
    where: { id: request.userId },
    data: { role: request.newRole },
  });

  sendRoleChangeApprovalEmail(request.user.id).catch(error => {
    console.error('Failed to send role change approval email:', error.message || error);
  });

  return request as RoleChangeRequest;
};

export const rejectRoleChangeRequest = async (requestId: string): Promise<RoleChangeRequest> => {
  const request = await prisma.roleChangeRequest.update({
    where: { id: requestId },
    data: { status: RequestStatus.REJECTED },
    include: { user: true },
  });

  if (!request.user) {
    throw new Error('User not found');
  }

  sendRoleChangeRejectionEmail(request.user.id).catch(error => {
    console.error('Failed to send role change rejection email:', error.message || error);
  });

  return request as RoleChangeRequest;
};

export const getRoleChangeRequests = async (): Promise<RoleChangeRequest[]> => {
  const requests = await prisma.roleChangeRequest.findMany({
    include: { user: true },
  });

  return requests as RoleChangeRequest[];
};