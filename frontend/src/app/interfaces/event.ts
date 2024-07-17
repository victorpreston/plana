import { Booking } from './booking';
import { User } from './user';
import { Category } from './category';
import { EventTag } from './tag';
import { TicketType } from './ticket';
import { Log } from './log';


export interface Event {
    id: string;
    title: string;
    description: string;
    date: Date;
    time: Date;
    location: string;
    bannerImage?: string;
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
  