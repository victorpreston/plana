import { User } from './user.interfaces';
import { Event } from './event.interfaces';
import { Booking } from './booking.interfaces';

export interface Log {
  id: string;
  userId?: string;
  eventId?: string;
  bookingId?: string;
  action: string; // e.g., "user_signin", "user_signout", "event_booked"
  timestamp: Date;
  user?: User;
  event?: Event;
  booking?: Booking;
}