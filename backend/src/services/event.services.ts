import prisma from '../config/database.config';
import logger from '../config/logger.config';
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
      bookings: {
        include: {
          user: true,
          event: true,
          ticketType: true,
        },
      },
      manager: true,
      category: true,
      tags: {
        include: {
          tag: true,
        },
      },
    },
  });

  return mapEvent(newEvent);
};

// /**
//  * Function to update an event
//  * @param id 
//  * @param eventData 
//  * @returns 
//  */
// export const updateEvent = async (id: string, eventData: Partial<Event>): Promise<Event> => {
//   console.log('Received update payload:', eventData); // Log the incoming payload

//   const updatedEvent = await prisma.event.update({
//     where: { id },
//     data: {
//       title: eventData.title,
//       description: eventData.description,
//       date: eventData.date,
//       time: eventData.time,
//       location: eventData.location,
//       bannerImage: eventData.bannerImage,
//       manager: eventData.managerId ? { connect: { id: eventData.managerId } } : undefined,
//       category: eventData.categoryId ? { connect: { id: eventData.categoryId } } : undefined,
//       ticketTypes: {
//         upsert: eventData.ticketTypes?.map(ticketType => ({
//           where: { id: ticketType.id || undefined},
//           update: {
//             type: ticketType.type,
//             price: ticketType.price,
//             quantity: ticketType.quantity,
//           },
//           create: {
//             type: ticketType.type,
//             price: ticketType.price,
//             quantity: ticketType.quantity,
//           },
//         })),
//       },
//       tags: {
//         upsert: eventData.tags?.map(tag => ({
//           where: { eventId_tagId: { eventId: id, tagId: tag.tagId } },
//           update: {},
//           create: { tag: { connect: { id: tag.tagId } } },
//         })),
//       },
//     },
//     include: {
//       ticketTypes: true,
//       bookings: {
//         include: {
//           user: true,
//           event: true,
//           ticketType: true,
//         },
//       },
//       manager: true,
//       category: true,
//       tags: {
//         include: {
//           tag: true,
//         },
//       },
//     },
//   });

//   return mapEvent(updatedEvent);
// };

/**
 * Function to update an event
 * @param id 
 * @param eventData 
 * @returns 
 */
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
          where: { id: ticketType.id || '' },
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
      bookings: {
        include: {
          user: true,
          event: true,
          ticketType: true,
        },
      },
      manager: true,
      category: true,
      tags: {
        include: {
          tag: true,
        },
      },
    },
  });

  return mapEvent(updatedEvent);
};


/**
 * get all events
 * @returns 
 */
export const getAllEvents = async (): Promise<Event[]> => {
  const events = await prisma.event.findMany({
    where: { isDeleted: false },
    include: {
      ticketTypes: true,
      bookings: {
        include: {
          user: true,
          event: true,
          ticketType: true,
        },
      },
      manager: true,
      category: true,
      tags: {
        include: {
          tag: true,
        },
      },
    },
  });

  return events.map(mapEvent);
};

/**
 * Function to fetch an event by ID
 * @param id 
 * @returns 
 */
export const getEventById = async (id: string): Promise<Event | null> => {
  const event = await prisma.event.findUnique({
    where: { id },
    include: {
      ticketTypes: true,
      bookings: {
        include: {
          user: true,
          event: true,
          ticketType: true,
        },
      },
      manager: true,
      category: true,
      tags: {
        include: {
          tag: true,
        },
      },
    },
  });

  return event ? mapEvent(event) : null;
};

/**
 * Function to delete an event (soft delete)
 * @param id 
 */
export const deleteEvent = async (id: string): Promise<void> => {
  await prisma.event.update({
    where: { id },
    data: { isDeleted: true },
  });
};



/**
 * Function to get events created by a specific manager
 * @param managerId 
 * @returns 
 */
export const getEventsByManager = async (managerId: string): Promise<Event[]> => {
  const events = await prisma.event.findMany({
    where: { managerId, isDeleted: false },
    include: {
      ticketTypes: true,
      bookings: {
        include: {
          user: true,
          event: true,
          ticketType: true,
        },
      },
      manager: true,
      category: true,
      tags: {
        include: {
          tag: true,
        },
      },
    },
  });

  return events.map(mapEvent);
};


/**
 * Function to map Prisma Event to TypeScript Event interface
 * @param prismaEvent 
 * @returns 
 */
const mapEvent = (prismaEvent: any): Event => {
  return {
    ...prismaEvent,
    bookings: prismaEvent.bookings.map((booking: any) => ({
      ...booking,
      user: {
        id: booking.user.id,
        email: booking.user.email,
        role: booking.user.role,
        createdAt: booking.user.createdAt,
        updatedAt: booking.user.updatedAt,
        isDeleted: booking.user.isDeleted,
      },
      event: {
        id: booking.event.id,
        title: booking.event.title,
        description: booking.event.description,
        date: booking.event.date,
        time: booking.event.time,
        location: booking.event.location,
        bannerImage: booking.event.bannerImage,
        managerId: booking.event.managerId,
        categoryId: booking.event.categoryId,
        createdAt: booking.event.createdAt,
        updatedAt: booking.event.updatedAt,
        isDeleted: booking.event.isDeleted,
      },
      ticketType: {
        id: booking.ticketType.id,
        eventId: booking.ticketType.eventId,
        type: booking.ticketType.type,
        price: booking.ticketType.price,
        quantity: booking.ticketType.quantity,
        createdAt: booking.ticketType.createdAt,
        updatedAt: booking.ticketType.updatedAt,
        isDeleted: booking.ticketType.isDeleted,
      },
    })),
  };
};