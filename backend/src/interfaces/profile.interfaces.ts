import { User } from './user.interfaces';

export interface Profile {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  phone?: string;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
  user?: User; // Make user optional to avoid circular dependency issues
}