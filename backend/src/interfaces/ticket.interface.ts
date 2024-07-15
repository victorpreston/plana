import { Event } from './event.interface';
import { Booking } from './booking.interface';

export interface Ticket {
  id: string;
  type: string;
  price: number;
  availableCount: number;
  event: Event;
  eventId: string;
  bookings: Booking[];
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}