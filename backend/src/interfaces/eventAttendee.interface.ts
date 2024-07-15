import { Event } from './event.interface';
import { User } from './user.interface';

export interface EventAttendee {
  id: string;
  eventId: string;
  userId: string;
  event: Event;
  user: User;
  isDeleted: boolean;
}