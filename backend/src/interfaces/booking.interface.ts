import { User } from './user.interface';
import { Event } from './event.interface';
import { Ticket } from './ticket.interface';

export interface Booking {
  id: string;
  userId: string;
  eventId: string;
  ticketId: string;
  status: string; // "booked", "canceled", "checked-in"
  qrCodeUrl: string;
  user: User;
  event: Event;
  ticket: Ticket;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}