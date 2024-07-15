import { User } from './user.interfaces';
import { Event } from './event.interfaces';
import { Log } from './log.interfaces';

export interface Booking {
  id: string;
  userId: string;
  eventId: string;
  tickets: number; // number of tickets booked
  status: string; // e.g., "confirmed", "cancelled"
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
  user: User;
  event: Event;
  logs?: Log[];
}