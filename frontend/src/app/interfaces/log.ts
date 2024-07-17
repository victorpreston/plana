import { User } from './user';
import { Booking } from './booking';

export interface Log {
    id: string;
    userId?: string;
    eventId?: string;
    bookingId?: string;
    action: string;
    timestamp: Date;
    user?: User;
    event?: Event;
    booking?: Booking;
}
  