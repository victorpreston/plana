import sendMail from '../email.service';
import { getUserById } from '../../services/user.services';
import { EmailOptions } from '../interfaces/email.interface';
import { env } from '../../config/env.config';

export const sendRoleChangeRequestEmail = async (userId: string) => {
  const user = await getUserById(userId);

  if (!user) {
    throw new Error('User not found');
  }

  const emailOptions: EmailOptions = {
    email: env.adminEmail,
    subject: 'New Role Change Request',
    template: 'role-change-request',
    body: {
      user,
    },
  };

  sendMail(emailOptions).catch(error => {
    console.error('Failed to send role change request email:', error.message || error);
  });
};

export const sendRoleChangeApprovalEmail = async (userId: string) => {
  const user = await getUserById(userId);

  if (!user) {
    throw new Error('User not found');
  }

  const emailOptions: EmailOptions = {
    email: user.email,
    subject: 'Role Change Request Approved',
    template: 'role-change-approval',
    body: {
      user,
    },
  };

  sendMail(emailOptions).catch(error => {
    console.error('Failed to send role change approval email:', error.message || error);
  });
};

export const sendRoleChangeRejectionEmail = async (userId: string) => {
  const user = await getUserById(userId);

  if (!user) {
    throw new Error('User not found');
  }

  const emailOptions: EmailOptions = {
    email: user.email,
    subject: 'Role Change Request Rejected',
    template: 'role-change-rejection',
    body: {
      user,
    },
  };

  sendMail(emailOptions).catch(error => {
    console.error('Failed to send role change rejection email:', error.message || error);
  });
};