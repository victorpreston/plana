import { User } from './user.interfaces';
import { Event } from './event.interfaces';
import { Log } from './log.interfaces';
import { TicketType } from './ticket.interfaces';

export interface Booking {
  id: string;
  userId: string;
  eventId: string;
  ticketTypeId: string; // Add ticket type ID
  tickets: number; // number of tickets booked
  status: string; // e.g., "confirmed", "cancelled"
  ticketCode: string; // ticket code for verification
  totalPrice: number; // total price for the booking
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
  user: User;
  event: Event;
  ticketType: TicketType; // Add ticket type relation
  logs?: Log[];
}