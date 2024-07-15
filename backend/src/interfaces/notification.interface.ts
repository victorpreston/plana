import { User } from './user.interface';

export interface Notification {
  id: string;
  userId: string;
  content: string;
  type: string; // "in-app", "push"
  status: string; // "pending", "read"
  user: User;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}