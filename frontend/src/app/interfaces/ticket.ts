export interface TicketType {
    id: string;
    eventId: string;
    type: string; // e.g., "single", "group"
    price: number;
    quantity: number;
    createdAt: Date;
    updatedAt: Date;
    isDeleted: boolean;
    event: Event;
}
  