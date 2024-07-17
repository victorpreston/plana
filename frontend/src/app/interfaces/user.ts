import { Booking } from './booking';
import { Profile } from './profile';
import { Log } from './log';


export enum Role {
    ATTENDEE = 'ATTENDEE',
    MANAGER = 'MANAGER',
    ADMIN = 'ADMIN',
}
  
  export interface User {
    id: string;
    email: string;
    password: string;
    role: Role;
    profile?: Profile;
    bookings?: Booking[];
    events?: Event[];
    createdAt: Date;
    updatedAt: Date;
    isDeleted: boolean;
    logs?: Log[];
}