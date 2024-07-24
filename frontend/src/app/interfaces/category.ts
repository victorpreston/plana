import { Event } from './event';
export interface Category {
    id: string;
    name: string;
    events: Event[];
    createdAt: Date;
    updatedAt: Date;
    isDeleted: boolean;
}
  