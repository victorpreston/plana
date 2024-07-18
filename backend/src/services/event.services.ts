import prisma from '../config/database.config';
import { Event } from '../interfaces/event.interfaces';

/**
 * Function to create an event
 * @param eventData 
 * @returns 
 */
export const createEvent = async (eventData: Partial<Event>): Promise<Event> => {
  const newEvent = await prisma.event.create({
    data: {
      title: eventData.title!,
      description: eventData.description!,
      date: eventData.date!,
      time: eventData.time!,
      location: eventData.location!,
      bannerImage: eventData.bannerImage,
      manager: { connect: { id: eventData.managerId! } },
      category: { connect: { id: eventData.categoryId! } },
      ticketTypes: {
        create: eventData.ticketTypes?.map(ticketType => ({
          type: ticketType.type,
          price: ticketType.price,
          quantity: ticketType.quantity,
        })),
      },
      tags: {
        create: eventData.tags?.map(tag => ({
          tag: { connect: { id: tag.tagId } },
        })),
      },
    },
    include: {
      ticketTypes: true,
      bookings: true,
      manager: true,
      category: true,
      tags: {
        include: {
          tag: true,
        },
      },
    },
  });

  return newEvent as Event;
};

// Function to update an event
export const updateEvent = async (id: string, eventData: Partial<Event>): Promise<Event> => {
  const updatedEvent = await prisma.event.update({
    where: { id },
    data: {
      title: eventData.title,
      description: eventData.description,
      date: eventData.date,
      time: eventData.time,
      location: eventData.location,
      bannerImage: eventData.bannerImage,
      manager: eventData.managerId ? { connect: { id: eventData.managerId } } : undefined,
      category: eventData.categoryId ? { connect: { id: eventData.categoryId } } : undefined,
      ticketTypes: {
        upsert: eventData.ticketTypes?.map(ticketType => ({
          where: { id: ticketType.id },
          update: {
            type: ticketType.type,
            price: ticketType.price,
            quantity: ticketType.quantity,
          },
          create: {
            type: ticketType.type,
            price: ticketType.price,
            quantity: ticketType.quantity,
          },
        })),
      },
      tags: {
        upsert: eventData.tags?.map(tag => ({
          where: { eventId_tagId: { eventId: id, tagId: tag.tagId } },
          update: {},
          create: { tag: { connect: { id: tag.tagId } } },
        })),
      },
    },
    include: {
      ticketTypes: true,
      bookings: true,
      manager: true,
      category: true,
      tags: {
        include: {
          tag: true,
        },
      },
    },
  });

  return updatedEvent as Event;
};

// Function to fetch all events
export const getAllEvents = async (): Promise<Event[]> => {
  const events = await prisma.event.findMany({
    where: { isDeleted: false },
    include: {
      ticketTypes: true,
      bookings: true,
      manager: true,
      category: true,
      tags: {
        include: {
          tag: true,
        },
      },
    },
  });

  return events as Event[];
};

// Function to fetch an event by ID
export const getEventById = async (id: string): Promise<Event | null> => {
  const event = await prisma.event.findUnique({
    where: { id },
    include: {
      ticketTypes: true,
      bookings: true,
      manager: true,
      category: true,
      tags: {
        include: {
          tag: true,
        },
      },
    },
  });

  return event ? (event as Event) : null;
};

// Function to delete an event (soft delete)
export const deleteEvent = async (id: string): Promise<void> => {
  await prisma.event.update({
    where: { id },
    data: { isDeleted: true },
  });
};