import { Address } from './address.interface';
import { Booking } from './booking.interface';
import { Event } from './event.interface';
import { EventAttendee } from './eventAttendee.interface';
import { Review } from './review.interface';
import { Notification } from './notification.interface';
import { ChatMessage } from './chatMessage.interface';
import { Conversation } from './conversation.interface';
import { AuditLog } from './auditLog.interface';
import { Role } from './role.enum';

export interface User {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  address?: Address;
  role: Role;
  profilePic?: string;
  isApproved: boolean;
  bookings: Booking[];
  events: Event[];
  attended: EventAttendee[];
  reviews: Review[];
  notifications: Notification[];
  chatMessages: ChatMessage[];
  conversations: Conversation[];
  auditLogs: AuditLog[];
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}