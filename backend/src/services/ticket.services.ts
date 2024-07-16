import prisma from '../config/database.config';
import { TicketType } from '../interfaces/ticket.interfaces';

// Function to create a new ticket type
export const createTicketType = async (ticketData: Omit<TicketType, 'id' | 'createdAt' | 'updatedAt' | 'isDeleted' | 'event'>): Promise<TicketType> => {
  const newTicketType = await prisma.ticketType.create({
    data: {
      type: ticketData.type,
      price: ticketData.price,
      quantity: ticketData.quantity,
      event: { connect: { id: ticketData.eventId } },
    },
  });

  return newTicketType as TicketType;
};

// Function to update a ticket type
export const updateTicketType = async (id: string, ticketData: Partial<TicketType>): Promise<TicketType> => {
  const { eventId, ...data } = ticketData;

  const updatedTicketType = await prisma.ticketType.update({
    where: { id },
    data: {
      ...data,
      event: eventId ? { connect: { id: eventId } } : undefined,
    },
  });

  return updatedTicketType as TicketType;
};

// Function to fetch all ticket types for an event
export const getTicketTypesByEventId = async (eventId: string): Promise<TicketType[]> => {
  const ticketTypes = await prisma.ticketType.findMany({
    where: { eventId, isDeleted: false },
  });

  return ticketTypes as TicketType[];
};

// Function to delete a ticket type (soft delete)
export const deleteTicketType = async (id: string): Promise<void> => {
  await prisma.ticketType.update({
    where: { id },
    data: { isDeleted: true },
  });
};