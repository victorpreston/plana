import { Request, Response } from 'express';
import { 
  createTicketType, 
  updateTicketType, 
  getTicketTypesByEventId, 
  deleteTicketType 
} from '../services/ticket.services';

/**
 * Create a new ticket type
 * @param req 
 * @param res 
 */
export const create = async (req: Request, res: Response) => {
  try {
    const ticketData = req.body;
    const ticketType = await createTicketType(ticketData);
    res.status(201).json(ticketType);
  } catch (error) {
    const err = error as Error;
    res.status(400).json({ error: err.message });
  }
};


/**
 * Update a ticket type
 * @param req 
 * @param res 
 */
export const update = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const ticketData = req.body;
    const ticketType = await updateTicketType(id, ticketData);
    res.status(200).json(ticketType);
  } catch (error) {
    const err = error as Error;
    res.status(400).json({ error: err.message });
  }
};


/**
 * Get all ticket types for an event
 * @param req 
 * @param res 
 */
export const getByEventId = async (req: Request, res: Response) => {
  try {
    const { eventId } = req.params;
    const ticketTypes = await getTicketTypesByEventId(eventId);
    res.status(200).json(ticketTypes);
  } catch (error) {
    const err = error as Error;
    res.status(400).json({ error: err.message });
  }
};


/**
 * Remove a ticket type
 * @param req 
 * @param res 
 */
export const remove = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await deleteTicketType(id);
    res.status(204).send();
  } catch (error) {
    const err = error as Error;
    res.status(400).json({ error: err.message });
  }
};