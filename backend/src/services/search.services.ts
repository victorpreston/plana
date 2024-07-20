import prisma from '../config/database.config';

export const searchUsers = async (query: string) => {
  const users = await prisma.user.findMany({
    where: {
      OR: [
        { email: { contains: query, mode: 'insensitive' } },
        { profile: { firstName: { contains: query, mode: 'insensitive' } } },
        { profile: { lastName: { contains: query, mode: 'insensitive' } } },
      ],
    },
    include: { profile: true },
  });

  return users;
};

export const searchEvents = async (query: string) => {
  const events = await prisma.event.findMany({
    where: {
      OR: [
        { title: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
        { location: { contains: query, mode: 'insensitive' } },
      ],
    },
  });

  return events;
};

export const searchBookings = async (query: string) => {
  const bookings = await prisma.booking.findMany({
    where: {
      OR: [
        { ticketCode: { contains: query, mode: 'insensitive' } },
        { user: { email: { contains: query, mode: 'insensitive' } } },
      ],
    },
    include: { user: true, event: true, ticketType: true },
  });

  return bookings;
};

export const searchCategories = async (query: string) => {
  const categories = await prisma.category.findMany({
    where: {
      name: { contains: query, mode: 'insensitive' },
    },
  });

  return categories;
};

export const searchTags = async (query: string) => {
  const tags = await prisma.tag.findMany({
    where: {
      name: { contains: query, mode: 'insensitive' },
    },
  });

  return tags;
};

export const searchTickets = async (query: string) => {
  const tickets = await prisma.ticketType.findMany({
    where: {
      type: { contains: query, mode: 'insensitive' },
    },
  });

  return tickets;
};