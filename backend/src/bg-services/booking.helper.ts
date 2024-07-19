import prisma from '../config/database.config';
import { Booking } from '../interfaces/booking.interfaces';
import { mapRole } from '../services/user.services';
import { Category } from '../interfaces/category.interfaces';
import { Tag } from '../interfaces/tag.interfaces';
import { User } from '../interfaces/user.interfaces';

/**
 * Retrieves the details of a booking.
 * @param bookingId - The ID of the booking.
 * @returns A Promise
 */
export const getBookingDetails = async (bookingId: string): Promise<Booking | null> => {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: {
      user: true,
      event: {
        include: {
          ticketTypes: true,
          bookings: {
            include: {
              user: true,
              event: true,
              ticketType: true,
            }
          },
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

  if (!booking) {
    return null;
  }

  const mapCategory = (category: any): Category => ({
    ...category,
    events: [],
  });

  const mapTag = (tag: any): Tag => ({
    ...tag,
    events: [],
  });

  const mapUser = (user: any): User => ({
    ...user,
    role: mapRole(user.role),
    profile: user.profile,
    bookings: [],
    events: [],
  });

  const mappedEvent = {
    ...booking.event,
    ticketTypes: booking.event.ticketTypes,
    bookings: booking.event.bookings.map((b: any) => ({
      ...b,
      user: mapUser(b.user),
      event: booking.event,
      ticketType: b.ticketType,
    })),
    manager: mapUser(booking.event.manager),
    category: mapCategory(booking.event.category),
    tags: booking.event.tags.map((tag: any) => ({
      ...tag,
      event: booking.event,
      tag: mapTag(tag.tag),
    })),
  };

  return {
    ...booking,
    user: mapUser(booking.user),
    event: mappedEvent,
    ticketType: booking.ticketType,
  };
};