import { User } from './user.interface';
import { Ticket } from './ticket.interface';
import { EventAttendee } from './eventAttendee.interface';
import { Booking } from './booking.interface';
import { Category } from './category.interface';
import { Tag } from './tag.interface';

export interface Event {
  id: string;
  title: string;
  description: string;
  date: Date;
  time: Date;
  location: string;
  bannerUrl?: string;
  createdBy: User;
  createdById: string;
  tickets: Ticket[];
  attendees: EventAttendee[];
  bookings: Booking[];
  categoryId: string;
  category: Category;
  tags: Tag[];
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}