import { Request, Response } from 'express';
import { 
  createBooking, 
  updateBooking, 
  getRecentBookings,
   cancelBooking, 
   getBookingsForEvent, 
   verifyTicketCode,
   getBookingById 
} from '../services/booking.services';

// Create a new booking
export const create = async (req: Request, res: Response) => {
  try {
    const bookingData = req.body;
    const booking = await createBooking(bookingData);
    res.status(201).json(booking);
  } catch (error) {
    const err = error as Error;
    res.status(400).json({ error: err.message });
  }
};

// Get recent bookings for a user
export const getRecent = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const bookings = await getRecentBookings(userId);
    res.status(200).json(bookings);
  } catch (error) {
    const err = error as Error;
    res.status(400).json({ error: err.message });
  }
};

// Cancel a booking
export const cancel = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await cancelBooking(id);
    res.status(204).send();
  } catch (error) {
    const err = error as Error;
    res.status(400).json({ error: err.message });
  }
};

// Update a booking
export const update = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const bookingData = req.body;
    const booking = await updateBooking(id, bookingData);
    res.status(200).json(booking);
  } catch (error) {
    const err = error as Error;
    res.status(400).json({ error: err.message });
  }
};

// Get a booking by ID
export const getById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const booking = await getBookingById(id);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    res.status(200).json(booking);
  } catch (error) {
    const err = error as Error;
    res.status(400).json({ error: err.message });
  }
};

// Get bookings for an event
export const getForEvent = async (req: Request, res: Response) => {
  try {
    const { eventId } = req.params;
    const bookings = await getBookingsForEvent(eventId);
    res.status(200).json(bookings);
  } catch (error) {
    const err = error as Error;
    res.status(400).json({ error: err.message });
  }
};

// Verify a ticket code
export const verify = async (req: Request, res: Response) => {
  try {
    const { ticketCode } = req.params;
    const booking = await verifyTicketCode(ticketCode);
    if (!booking) {
      return res.status(404).json({ error: 'Invalid or expired ticket' });
    }
    res.status(200).json(booking);
  } catch (error) {
    const err = error as Error;
    res.status(400).json({ error: err.message });
  }
};