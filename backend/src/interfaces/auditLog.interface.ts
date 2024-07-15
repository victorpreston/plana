import { User } from './user.interface';

export interface AuditLog {
  id: string;
  userId?: string;
  action: string;
  details?: string;
  user?: User;
  createdAt: Date;
}