import { Event } from './event.interface';

export interface Category {
  id: string;
  name: string;
  description?: string;
  events: Event[];
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}