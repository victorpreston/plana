import prisma from '../config/database.config';
import { Booking } from '../interfaces/booking.interfaces';
import { v4 as uuidv4 } from 'uuid';


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

  const newBooking = await prisma.booking.create({
    data: {
      userId: bookingData.userId!,
      eventId: bookingData.eventId!,
      ticketTypeId: bookingData.ticketTypeId!,
      tickets: bookingData.tickets!,
      status: 'confirmed',
      ticketCode: uuidv4(), /*Generate a unique ticket code*/
      totalPrice,
    },
    include: {
      user: true,
      event: true,
      ticketType: true,
    },
  });

  return newBooking as Booking;
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
      event: true,
      ticketType: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  return bookings as Booking[];
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
    include: { ticketType: true },
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
      event: true,
      ticketType: true,
    },
  });

  return updatedBooking as Booking;
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
      event: true,
      ticketType: true,
    },
  });

  if (!booking || booking.isDeleted) {
    return null;
  }

  return booking as Booking;
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
      event: true,
      ticketType: true,
    },
  });

  return bookings as Booking[];
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
      event: true,
      ticketType: true,
    },
  });

  if (!booking || booking.status !== 'confirmed' || booking.isDeleted) {
    return null;
  }

  return booking as Booking;
};