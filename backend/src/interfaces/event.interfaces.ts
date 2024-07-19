import { TicketType } from './ticket.interfaces';
import { Booking } from './booking.interfaces';
import { User } from './user.interfaces';
import { Category } from './category.interfaces';
import { EventTag } from './tag.interfaces';
import { Log } from './log.interfaces';

export interface Event {
  id: string;
  title: string;
  description: string;
  date: Date;
  time: Date;
  location: string;
  bannerImage?: string | null;
  ticketTypes: TicketType[];
  bookings: Booking[];
  managerId: string;
  manager: User;
  categoryId: string;
  category: Category;
  tags: EventTag[];
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
  logs?: Log[];
}