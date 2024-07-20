import { Booking } from "@prisma/client";

/**
 * Function to map Prisma Booking to TypeScript Booking interface
 * @param prismaBooking 
 * @returns 
 */
export const mapBooking = (prismaBooking: any): Booking => {
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