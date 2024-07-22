import { User } from './user';
import { TicketType } from './ticket';
import { Log } from './log';
import { Event } from './event';


export interface Booking {
    id: string;
    userId: string;
    eventId: string;
    ticketTypeId: string;
    tickets: number;
    status: string;
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
  