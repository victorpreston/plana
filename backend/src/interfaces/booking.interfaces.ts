import { User } from './user.interfaces';
import { Event } from './event.interfaces';
import { Log } from './log.interfaces';
import { TicketType } from './ticket.interfaces';

export interface Booking {
  id: string;
  userId: string;
  eventId: string;
  ticketTypeId: string;
  tickets: number;
  status: string; /** confirmed, cancelled, reinstated*/
  ticketCode: string;
  totalPrice: number;
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
  user: User;
  event: Event;
  ticketType: TicketType;
  logs?: Log[];
}