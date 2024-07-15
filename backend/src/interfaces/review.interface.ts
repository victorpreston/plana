import { User } from './user.interface';

export interface Review {
  id: string;
  userId: string;
  rating: number; // Rating from 1 to 5
  comment: string;
  user: User;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}