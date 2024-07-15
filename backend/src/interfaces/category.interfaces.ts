import { Event } from './event.interfaces';

export interface Category {
  id: string;
  name: string;
  events: Event[];
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
}