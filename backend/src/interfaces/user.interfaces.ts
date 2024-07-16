import { Profile } from './profile.interfaces';
import { Booking } from './booking.interfaces';
import { Event } from './event.interfaces';
import { Log } from './log.interfaces';

export { Profile };

export interface User {
  id: string;
  email: string;
  password: string;
  role: Role;
  profile?: Profile;
  bookings?: Booking[];
  events?: Event[];
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
  logs?: Log[];
}

export enum Role {
  ATTENDEE = 'ATTENDEE',
  MANAGER = 'MANAGER',
  ADMIN = 'ADMIN',
}