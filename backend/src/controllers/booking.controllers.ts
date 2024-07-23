import { Request, Response } from 'express';
import { 
  createBooking, 
  updateBooking, 
  getRecentBookings,
   cancelBooking, 
   getBookingsForEvent, 
   verifyTicketCode,
   getBookingById,
   getUserBookings
} from '../services/booking.services';
import { AuthRequest } from '../middleware/auth.middleware';



/**
 * Create a new booking
 * @param req 
 * @param res 
 */
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



/**
 * Get recent bookings for a user
 * @param req 
 * @param res 
 */
export const getRecent = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    console.log(userId)
    const bookings = await getRecentBookings(userId);
    res.status(200).json(bookings);
  } catch (error) {
    const err = error as Error;
    res.status(400).json({ error: err.message });
  }
};



/**
 * Cancel a booking
 * @param req 
 * @param res 
 */
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



/**
 * Update a booking
 * @param req 
 * @param res 
 */
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



/**
 * Get a booking by ID
 * @param req 
 * @param res 
 * @returns 
 */
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



/**
 * Get bookings for an event
 * @param req 
 * @param res 
 */
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


/**
 * Get bookings for a specific user
 * @param req 
 * @param res 
 */
export const getUserBookingsController = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.userId; // Assuming req.user contains the authenticated user's details
    const bookings = await getUserBookings(userId);
    res.status(200).json(bookings);
  } catch (error) {
    const err = error as Error;
    res.status(400).json({ error: err.message });
  }
};
/**
 * Verify a ticket code
 * @param req 
 * @param res 
 * @returns 
 */
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