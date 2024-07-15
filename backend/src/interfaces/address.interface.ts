import { User } from './user.interface';

export interface Address {
  id: string;
  street?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  userId: string;
  user: User;
}