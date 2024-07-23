import prisma from '../config/database.config';
import { Booking } from '../interfaces/booking.interfaces';
import { getBookingDetails } from '../bg-services/booking.helper';
import { sendBookingConfirmationEmail } from '../bg-services/mails/booking';
import { sendTicketVerificationEmail } from '../bg-services/mails/ticket-verified';
/**
 * Function to generate a random alphanumeric string
 * @param length 
 * @returns 
 */
const generateRandomCode = (length: number): string => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

/**
 * Function to create a new booking
 * @param bookingData 
 * @returns 
 */
export const createBooking = async (bookingData: Partial<Booking>): Promise<Booking> => {
  const ticketType = await prisma.ticketType.findUnique({
    where: { id: bookingData.ticketTypeId! },
  });

  if (!ticketType) {
    throw new Error('Invalid ticket type');
  }

  const totalPrice = ticketType.price * bookingData.tickets!;
  const ticketCode = generateRandomCode(10);

  const newBooking = await prisma.booking.create({
    data: {
      userId: bookingData.userId!,
      eventId: bookingData.eventId!,
      ticketTypeId: bookingData.ticketTypeId!,
      tickets: bookingData.tickets!,
      status: 'confirmed',
      ticketCode,
      totalPrice,
    },
    include: {
      user: true,
      event: {
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
      },
      ticketType: true,
    },
  });

  const bookingDetails = await getBookingDetails(newBooking.id);

  if (bookingDetails) {
    sendBookingConfirmationEmail(bookingDetails).catch(error => {
      console.error('Failed to send booking confirmation email:', error.message || error);
    });
  }

  return mapBooking(newBooking);
};

/**
 * Function to get recent bookings for a user
 * @param userId 
 * @returns 
 */
export const getRecentBookings = async (userId: string): Promise<Booking[]> => {
  const bookings = await prisma.booking.findMany({
    where: { userId, isDeleted: false },
    include: {
      user: true,
      event: {
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
      },
      ticketType: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  return bookings.map(mapBooking);
};

/**
 * Function to cancel a booking
 * @param id 
 */
export const cancelBooking = async (id: string): Promise<void> => {
  await prisma.booking.update({
    where: { id },
    data: { status: 'cancelled', isDeleted: true },
  });
};

/**
 * Function to update a booking
 * @param id 
 * @param bookingData 
 * @returns 
 */
export const updateBooking = async (id: string, bookingData: Partial<Booking>): Promise<Booking> => {
  const booking = await prisma.booking.findUnique({
    where: { id },
    include: {
      ticketType: true,
      event: {
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
      },
    },
  });

  if (!booking) {
    throw new Error('Booking not found');
  }

  const totalPrice = booking.ticketType.price * (bookingData.tickets ?? booking.tickets);

  const updatedBooking = await prisma.booking.update({
    where: { id },
    data: {
      tickets: bookingData.tickets,
      status: bookingData.status,
      totalPrice,
    },
    include: {
      user: true,
      event: {
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
      },
      ticketType: true,
    },
  });

  return mapBooking(updatedBooking);
};

/**
 * Function to get a booking by ID
 * @param id 
 * @returns 
 */
export const getBookingById = async (id: string): Promise<Booking | null> => {
  const booking = await prisma.booking.findUnique({
    where: { id },
    include: {
      user: true,
      event: {
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
      },
      ticketType: true,
    },
  });

  if (!booking || booking.isDeleted) {
    return null;
  }

  return mapBooking(booking);
};

/**
 * Function to get the number of bookings for an event
 * @param eventId 
 * @returns 
 */
export const getBookingsForEvent = async (eventId: string): Promise<Booking[]> => {
  const bookings = await prisma.booking.findMany({
    where: { eventId, status: 'confirmed', isDeleted: false },
    include: {
      user: true,
      event: {
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
      },
      ticketType: true,
    },
  });

  return bookings.map(mapBooking);
};

/**
 * Function to get all bookings for a user:
 * @param userId 
 * @returns 
 */
export const getUserBookings = async (userId: string): Promise<Booking[]> => {
  const bookings = await prisma.booking.findMany({
    where: {
      userId: userId,
      isDeleted: false,
    },
    include: {
      user: true,
      event: {
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
      },
      ticketType: true,
    },
  });

  return bookings.map(mapBooking);
};


/**
 * Function to verify a ticket code
 * @param ticketCode 
 * @returns 
 */
export const verifyTicketCode = async (ticketCode: string): Promise<Booking | null> => {
  const booking = await prisma.booking.findUnique({
    where: { ticketCode },
    include: {
      user: true,
      event: {
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
      },
      ticketType: true,
    },
  });

  if (!booking || booking.status !== 'confirmed' || booking.isDeleted) {
    return null;
  }

  const bookingDetails = await getBookingDetails(booking.id);

  if (bookingDetails) {
    sendTicketVerificationEmail(bookingDetails).catch(error => {
      console.error('Failed to send ticket verification email:', error.message || error);
    });
  }

  return mapBooking(booking);
};







/**
 * Function to map Prisma Booking to TypeScript Booking interface
 * @param prismaBooking 
 * @returns 
 */
const mapBooking = (prismaBooking: any): Booking => {
  return {
    ...prismaBooking,
    event: {
      ...prismaBooking.event,
      ticketTypes: prismaBooking.event.ticketTypes.map((ticketType: any) => ({
        id: ticketType.id,
        eventId: ticketType.eventId,
        type: ticketType.type,
        price: ticketType.price,
        quantity: ticketType.quantity,
        createdAt: ticketType.createdAt,
        updatedAt: ticketType.updatedAt,
        isDeleted: ticketType.isDeleted,
      })),
      bookings: prismaBooking.event.bookings.map((booking: any) => ({
        id: booking.id,
        userId: booking.userId,
        eventId: booking.eventId,
        ticketTypeId: booking.ticketTypeId,
        tickets: booking.tickets,
        status: booking.status,
        ticketCode: booking.ticketCode,
        totalPrice: booking.totalPrice,
        createdAt: booking.createdAt,
        updatedAt: booking.updatedAt,
        isDeleted: booking.isDeleted,
      })),
      manager: {
        id: prismaBooking.event.manager.id,
        email: prismaBooking.event.manager.email,
        role: prismaBooking.event.manager.role,
        createdAt: prismaBooking.event.manager.createdAt,
        updatedAt: prismaBooking.event.manager.updatedAt,
        isDeleted: prismaBooking.event.manager.isDeleted,
      },
      category: {
        id: prismaBooking.event.category.id,
        name: prismaBooking.event.category.name,
        createdAt: prismaBooking.event.category.createdAt,
        updatedAt: prismaBooking.event.category.updatedAt,
        isDeleted: prismaBooking.event.category.isDeleted,
      },
      tags: prismaBooking.event.tags.map((tag: any) => ({
        id: tag.tag.id,
        name: tag.tag.name,
        createdAt: tag.tag.createdAt,
        updatedAt: tag.tag.updatedAt,
        isDeleted: tag.tag.isDeleted,
      })),
    },
    user: {
      id: prismaBooking.user.id,
      email: prismaBooking.user.email,
      role: prismaBooking.user.role,
      createdAt: prismaBooking.user.createdAt,
      updatedAt: prismaBooking.user.updatedAt,
      isDeleted: prismaBooking.user.isDeleted,
    },
    ticketType: {
      id: prismaBooking.ticketType.id,
      eventId: prismaBooking.ticketType.eventId,
      type: prismaBooking.ticketType.type,
      price: prismaBooking.ticketType.price,
      quantity: prismaBooking.ticketType.quantity,
      createdAt: prismaBooking.ticketType.createdAt,
      updatedAt: prismaBooking.ticketType.updatedAt,
      isDeleted: prismaBooking.ticketType.isDeleted,
    },
  };
};