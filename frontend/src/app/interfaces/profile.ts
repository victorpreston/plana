import { User } from './user';

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
    user?: User;
}
  